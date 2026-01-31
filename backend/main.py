"""
Malicious URL Detection API

FastAPI backend for detecting malicious URLs using heuristic analysis
and optional machine learning models.
"""

import time
from typing import Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl, ValidationError
import uvicorn

from scanner.heuristics import calculate_heuristic_score, get_verdict
from scanner.model import URLClassifier

# Initialize FastAPI app
app = FastAPI(
    title="Malicious URL Detection API",
    description="API for detecting malicious URLs using heuristic and ML analysis",
    version="1.0.0"
)

# Enable CORS for browser extension
# CRITICAL FIX: Cannot use allow_credentials=True with allow_origins=["*"]
# Browsers block this combination for security.
# Solution: Use allow_credentials=False and allow all origins for localhost development
# In production, specify exact extension origins
app.add_middleware(
    CORSMiddleware,
    # For development: Allow all origins (localhost, 127.0.0.1, and extensions)
    # In production, replace with specific extension IDs:
    # allow_origins=["chrome-extension://your-extension-id-here"]
    allow_origins=["*"],  # Allow all for development
    allow_credentials=False,  # Must be False when using "*" origins
    allow_methods=["GET", "POST", "OPTIONS"],  # Explicit methods
    allow_headers=["Content-Type", "Accept", "Origin", "X-Requested-With"],  # Explicit headers
    expose_headers=["*"],  # Expose all response headers
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Optional: Load ML model if available
ml_model: Optional[URLClassifier] = None
try:
    ml_model = URLClassifier(model_type='random_forest')
    # Try to load pre-trained model if it exists
    # ml_model.load('backend/models/url_classifier.pkl')
except Exception as e:
    print(f"ML model not available: {e}. Using heuristic-only mode.")


class URLScanRequest(BaseModel):
    """Request model for URL scanning."""
    url: str


class URLScanResponse(BaseModel):
    """Response model for URL scanning."""
    url: str
    risk_score: int
    verdict: str
    reasons: list[str]
    ml_confidence: Optional[float] = None
    processing_time_ms: float


def validate_url(url: str) -> str:
    """
    Validate and normalize URL input.
    
    Args:
        url: URL string to validate
        
    Returns:
        Normalized URL string
        
    Raises:
        HTTPException: If URL is invalid
    """
    url = url.strip()
    
    # Add protocol if missing
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    # Basic validation
    if len(url) > 2048:  # Max URL length
        raise HTTPException(status_code=400, detail="URL too long (max 2048 characters)")
    
    if len(url) < 4:
        raise HTTPException(status_code=400, detail="URL too short")
    
    # Try to validate as HTTP URL
    try:
        HttpUrl(url)
    except ValidationError:
        raise HTTPException(status_code=400, detail="Invalid URL format")
    
    return url


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Malicious URL Detection API",
        "version": "1.0.0",
        "endpoints": {
            "/scan-url": "POST - Scan a URL for malicious content",
            "/health": "GET - Health check endpoint"
        }
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    Also handles OPTIONS preflight for CORS.
    """
    return {
        "status": "healthy",
        "ml_model_loaded": ml_model is not None and ml_model.is_trained,
        "timestamp": time.time()
    }


@app.options("/health")
async def health_check_options():
    """Handle CORS preflight for health endpoint."""
    return {"status": "ok"}


@app.get("/test-connection")
async def test_connection():
    """
    Simple connection test endpoint for debugging.
    Returns minimal response to verify connectivity.
    """
    return {
        "connected": True,
        "message": "Backend is reachable",
        "timestamp": time.time()
    }


@app.options("/test-connection")
async def test_connection_options():
    """Handle CORS preflight for test-connection endpoint."""
    return {"status": "ok"}


@app.options("/scan-url")
async def scan_url_options():
    """Handle CORS preflight for scan-url endpoint."""
    return {"status": "ok"}


@app.post("/scan-url", response_model=URLScanResponse)
async def scan_url(request: URLScanRequest):
    """
    Scan a URL for malicious content.
    
    This endpoint performs:
    1. URL validation
    2. Feature extraction
    3. Heuristic scoring
    4. Optional ML model prediction
    
    Args:
        request: URLScanRequest containing the URL to scan
        
    Returns:
        URLScanResponse with risk score, verdict, and reasons
    """
    start_time = time.time()
    
    try:
        # Validate URL
        validated_url = validate_url(request.url)
        
        # Calculate heuristic score
        risk_score, reasons = calculate_heuristic_score(validated_url)
        verdict = get_verdict(risk_score)
        
        # Optional: Get ML model prediction
        ml_confidence = None
        if ml_model and ml_model.is_trained:
            try:
                ml_prob, ml_pred = ml_model.predict(validated_url)
                ml_confidence = float(ml_prob)
                
                # Adjust risk score based on ML prediction if available
                if ml_pred == 1:  # Malicious
                    risk_score = min(100, risk_score + int(ml_confidence * 20))
                    reasons.append(f"ML model indicates malicious (confidence: {ml_confidence:.2f})")
                else:
                    # ML says benign, but keep heuristic score
                    reasons.append(f"ML model indicates benign (confidence: {1-ml_confidence:.2f})")
            except Exception as e:
                # ML model failed, continue with heuristic only
                print(f"ML prediction failed: {e}")
        
        processing_time = (time.time() - start_time) * 1000  # Convert to milliseconds
        
        return URLScanResponse(
            url=validated_url,
            risk_score=risk_score,
            verdict=verdict,
            reasons=reasons,
            ml_confidence=ml_confidence,
            processing_time_ms=round(processing_time, 2)
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/scan-url")
async def scan_url_get(url: str = Query(..., description="URL to scan")):
    """
    GET endpoint for URL scanning (alternative to POST).
    
    Args:
        url: URL to scan as query parameter
        
    Returns:
        URLScanResponse with risk score, verdict, and reasons
    """
    request = URLScanRequest(url=url)
    return await scan_url(request)


if __name__ == "__main__":
    # Run the API server
    # CRITICAL: host="0.0.0.0" allows connections from localhost, 127.0.0.1, and network
    # This is required for Chrome extensions to connect
    # For Render: Use PORT environment variable, disable reload in production
    import os
    
    port = int(os.environ.get("PORT", 8000))
    reload = os.environ.get("ENV", "production") != "production"
    
    print("=" * 60)
    print("Starting Malicious URL Detection API")
    print("=" * 60)
    print(f"Server will be available at:")
    print(f"  - http://localhost:{port}")
    print(f"  - http://127.0.0.1:{port}")
    print(f"  - http://0.0.0.0:{port}")
    print("=" * 60)
    print(f"API Documentation: http://localhost:{port}/docs")
    print(f"Health Check: http://localhost:{port}/health")
    print("=" * 60)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",  # Bind to all interfaces (required for extensions and Render)
        port=port,  # Use PORT env var for Render, default 8000 for local
        reload=reload,  # Disable reload in production (Render)
        log_level="info",
        access_log=True  # Log all requests for debugging
    )
