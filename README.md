# 🛡️ Malicious URL Detection System

A comprehensive malicious URL detection system with a browser extension frontend and Python FastAPI backend. Detects suspicious and malicious URLs using heuristic analysis, feature extraction, and optional machine learning models.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)

## ✨ Features

- **Real-time URL Scanning**: Scan URLs instantly via browser extension or API
- **Heuristic Analysis**: Rule-based scoring system for fast detection
- **Feature Extraction**: Comprehensive URL feature analysis
- **Machine Learning Support**: Optional ML model for enhanced detection
- **Browser Extension**: Chrome/Firefox extension for seamless protection
- **RESTful API**: FastAPI backend with comprehensive endpoints
- **Security**: Input validation, timeout handling, and error management

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│ Browser         │         │ Python Backend   │         │ ML Model     │
│ Extension       │────────▶│ (FastAPI)        │────────▶│ (Optional)   │
│                 │         │                  │         │              │
│ - Popup UI      │         │ - Feature Extract│         │ - RandomForest│
│ - Background    │         │ - Heuristic Score│         │ - LogisticReg│
│ - Content Script│         │ - API Endpoints  │         │              │
└─────────────────┘         └──────────────────┘         └──────────────┘
```

## 🚀 Quick Start from GitHub

### Clone and Setup

```bash
# Clone the repository
git clone https://github.com/manividyadhar/Malicious-URL-Detection.git
cd Malicious-URL-Detection

# Navigate to backend
cd backend

# Create virtual environment (recommended)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

The API will be available at `http://localhost:8000`

**See `GITHUB_SETUP.md` for detailed instructions.**

## 🚀 Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Chrome or Firefox browser
- Node.js (optional, for development)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On Linux/Mac:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend server:**
   ```bash
   python main.py
   ```
   
   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`

5. **Verify the API is running:**
   ```bash
   curl http://localhost:8000/health
   ```

### Browser Extension Setup

1. **Open Chrome/Edge:**
   - Navigate to `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" (toggle in top right)

2. **Load the extension:**
   - Click "Load unpacked"
   - Select the `extension` folder

3. **For Firefox:**
   - Navigate to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select `extension/manifest.json`

4. **Note:** You'll need to create icon files (`icon16.png`, `icon48.png`, `icon128.png`) or remove icon references from `manifest.json` for testing.

## 📖 Usage

### Browser Extension

1. **Scan Current Page:**
   - Click the extension icon in your browser toolbar
   - Click "Scan Current Page" button
   - View the risk score and analysis

2. **Scan Custom URL:**
   - Click the extension icon
   - Enter a URL in the input field
   - Click "Scan URL"
   - Review the results

3. **Automatic Protection:**
   - The extension automatically scans URLs when you navigate
   - Shows warnings for malicious URLs
   - Displays notifications for high-risk sites

### API Usage

#### Scan a URL (POST)

```bash
curl -X POST "http://localhost:8000/scan-url" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

#### Scan a URL (GET)

```bash
curl "http://localhost:8000/scan-url?url=https://example.com"
```

#### Health Check

```bash
curl http://localhost:8000/health
```

### Example API Response

```json
{
  "url": "https://example.com",
  "risk_score": 15,
  "verdict": "safe",
  "reasons": [
    "No suspicious patterns detected"
  ],
  "ml_confidence": null,
  "processing_time_ms": 12.34
}
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Endpoints

#### `POST /scan-url`
Scan a URL for malicious content.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "risk_score": 0-100,
  "verdict": "safe | suspicious | malicious",
  "reasons": ["reason1", "reason2"],
  "ml_confidence": 0.0-1.0 (optional),
  "processing_time_ms": 12.34
}
```

#### `GET /scan-url?url=<URL>`
Alternative GET endpoint for URL scanning.

#### `GET /health`
Health check endpoint.

#### `GET /`
API information and available endpoints.

## 🧪 Testing

### Test URLs

See `test_urls.txt` for sample URLs to test the system.

### Manual Testing

1. **Test Safe URL:**
   ```bash
   curl -X POST "http://localhost:8000/scan-url" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://www.google.com"}'
   ```

2. **Test Suspicious URL:**
   ```bash
   curl -X POST "http://localhost:8000/scan-url" \
     -H "Content-Type: application/json" \
     -d '{"url": "http://192.168.1.1/login/verify"}'
   ```

3. **Test Malicious Pattern:**
   ```bash
   curl -X POST "http://localhost:8000/scan-url" \
     -H "Content-Type: application/json" \
     -d '{"url": "http://free-prize-winner.click/claim-now"}'
   ```

### Training ML Model (Optional)

To train and use the ML model:

```python
from scanner.model import URLClassifier, create_sample_dataset

# Create classifier
classifier = URLClassifier(model_type='random_forest')

# Get sample dataset (replace with real dataset in production)
urls, labels = create_sample_dataset()

# Train model
classifier.train(urls, labels)

# Save model
classifier.save('backend/models/url_classifier.pkl')

# Load model in main.py
```

## 📂 Project Structure

```
.
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   └── scanner/
│       ├── __init__.py
│       ├── features.py         # URL feature extraction
│       ├── heuristics.py       # Rule-based scoring
│       └── model.py            # ML model implementation
│
├── extension/
│   ├── manifest.json           # Extension manifest
│   ├── background.js           # Background service worker
│   ├── content.js              # Content script for link monitoring
│   ├── popup.html              # Extension popup UI
│   ├── popup.js                # Popup logic
│   └── icon*.png               # Extension icons (create these)
│
├── test_urls.txt               # Sample test URLs
├── README.md                   # This file
└── api_examples.md             # API usage examples
```

## 🔍 URL Feature Extraction

The system extracts the following features:

- **URL Length**: Total character count
- **Dot Count**: Number of dots (subdomain analysis)
- **Hyphen Count**: Number of hyphens
- **Special Characters**: Unusual character patterns
- **IP Address Detection**: URLs using IPs instead of domains
- **Suspicious Keywords**: Phishing-related terms
- **HTTPS Check**: Protocol security
- **Subdomain Count**: Number of subdomains
- **Shortening Service**: URL shortener detection

## 🎯 Heuristic Scoring

Risk scores are calculated based on:

- **0-29**: Safe
- **30-69**: Suspicious
- **70-100**: Malicious

Factors affecting score:
- URL length and structure
- Character patterns
- IP address usage
- Suspicious keywords
- Missing HTTPS
- Excessive subdomains
- URL shortening services

## 🔐 Security Considerations

- Input validation and sanitization
- Timeout handling for API requests
- CORS configuration for extension
- Error handling and logging
- Rate limiting (recommended for production)

## 🚧 Production Deployment

For production deployment:

1. **Backend:**
   - Use a production ASGI server (e.g., Gunicorn with Uvicorn workers)
   - Set up proper CORS origins
   - Add rate limiting
   - Use environment variables for configuration
   - Enable HTTPS
   - Add authentication/API keys

2. **Extension:**
   - Update `API_BASE_URL` in `background.js` to production URL
   - Create proper extension icons
   - Submit to Chrome Web Store / Firefox Add-ons

3. **ML Model:**
   - Train on a comprehensive dataset
   - Regularly retrain with new data
   - Monitor model performance

## 📝 License

This project is provided as-is for educational and security research purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## ⚠️ Disclaimer

This tool is for educational and security research purposes. Always verify URL safety through multiple sources and use at your own risk.
