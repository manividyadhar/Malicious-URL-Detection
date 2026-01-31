# Setting Up and Running Backend from GitHub

## 🚀 Quick Start Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/manividyadhar/Malicious-URL-Detection.git
cd Malicious-URL-Detection
```

### Step 2: Navigate to Backend Directory

```bash
cd backend
```

### Step 3: Create Virtual Environment (Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

**Expected output:**
```
Collecting fastapi...
Collecting uvicorn...
Collecting pydantic...
...
Successfully installed fastapi-0.104.1 uvicorn-0.24.0 ...
```

### Step 5: Start the Backend Server

```bash
python main.py
```

**Expected output:**
```
============================================================
Starting Malicious URL Detection API
============================================================
Server will be available at:
  - http://localhost:8000
  - http://127.0.0.1:8000
  - http://0.0.0.0:8000
============================================================
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Step 6: Verify Backend is Running

Open your browser and visit:
- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs
- **Test Connection**: http://localhost:8000/test-connection

You should see JSON responses or the Swagger UI.

---

## 📋 Detailed Setup Instructions

### Prerequisites

- **Python 3.8 or higher**
- **pip** (Python package manager)
- **Git** (to clone repository)

### Check Python Version

```bash
python --version
# Should show: Python 3.8.x or higher
```

### Install Dependencies (Alternative Methods)

**Method 1: Using requirements.txt (Recommended)**
```bash
pip install -r requirements.txt
```

**Method 2: Install individually**
```bash
pip install fastapi uvicorn[standard] pydantic scikit-learn numpy python-multipart
```

**Method 3: If scikit-learn fails (Windows)**
```bash
# Install core packages first
pip install fastapi uvicorn[standard] pydantic python-multipart

# Then try scikit-learn with pre-built wheels
pip install --only-binary :all: scikit-learn numpy
```

---

## 🔧 Running the Backend

### Option 1: Using main.py (Recommended)

```bash
cd backend
python main.py
```

### Option 2: Using uvicorn directly

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Option 3: Production Mode (No Auto-reload)

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 🧪 Test the Backend

### Test 1: Health Check

```bash
curl http://localhost:8000/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "ml_model_loaded": false
}
```

### Test 2: Scan a URL

```bash
curl -X POST "http://localhost:8000/scan-url" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\": \"https://www.google.com\"}"
```

**Expected response:**
```json
{
  "url": "https://www.google.com",
  "risk_score": 5,
  "verdict": "safe",
  "reasons": ["No suspicious patterns detected"],
  "ml_confidence": null,
  "processing_time_ms": 8.45
}
```

### Test 3: Using Python Script

```bash
cd backend
python test_api.py
```

---

## 🌐 API Endpoints

Once backend is running, these endpoints are available:

- **GET /** - API information
- **GET /health** - Health check
- **GET /test-connection** - Connection test
- **POST /scan-url** - Scan a URL
- **GET /scan-url?url=...** - Scan URL (GET method)
- **GET /docs** - Interactive API documentation (Swagger UI)
- **GET /redoc** - Alternative API documentation

---

## 🔍 Troubleshooting

### Issue: "Module not found"

**Solution:**
```bash
pip install -r requirements.txt
```

### Issue: "Port 8000 already in use"

**Solution 1: Use different port**
```bash
# Edit backend/main.py, change port to 8001
uvicorn.run("main:app", host="0.0.0.0", port=8001, ...)
```

**Solution 2: Find and kill process using port 8000**

**Windows:**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -i :8000
kill -9 <PID>
```

### Issue: "Cannot connect to backend"

**Check:**
1. Backend is running (`python main.py`)
2. Port 8000 is accessible
3. Firewall isn't blocking
4. Try `http://127.0.0.1:8000` instead of `localhost`

### Issue: "scikit-learn installation fails"

**Solution:**
```bash
# Use pre-built wheels
pip install --only-binary :all: scikit-learn

# Or skip ML model (system works without it)
pip install fastapi uvicorn[standard] pydantic python-multipart
```

---

## 📦 Project Structure

```
Malicious-URL-Detection/
├── backend/
│   ├── main.py              # FastAPI application (START HERE)
│   ├── requirements.txt     # Python dependencies
│   ├── test_api.py         # Test script
│   └── scanner/
│       ├── __init__.py
│       ├── features.py     # URL feature extraction
│       ├── heuristics.py   # Rule-based scoring
│       └── model.py        # ML model (optional)
├── extension/              # Chrome extension
└── README.md
```

---

## 🎯 Quick Commands Reference

```bash
# Clone repository
git clone https://github.com/manividyadhar/Malicious-URL-Detection.git
cd Malicious-URL-Detection

# Setup backend
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate      # Linux/Mac
pip install -r requirements.txt

# Start backend
python main.py

# Test backend
python test_api.py
# Or visit: http://localhost:8000/docs
```

---

## ✅ Verification Checklist

- [ ] Repository cloned successfully
- [ ] Python 3.8+ installed
- [ ] Virtual environment created (optional)
- [ ] Dependencies installed
- [ ] Backend starts without errors
- [ ] Health check works: http://localhost:8000/health
- [ ] API docs accessible: http://localhost:8000/docs
- [ ] Can scan URLs via API

---

## 🚀 Next Steps

After backend is running:

1. **Load Chrome Extension:**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` folder

2. **Test Extension:**
   - Navigate to a website
   - Extension should auto-scan
   - Check for notifications and popup warnings

3. **View API Documentation:**
   - Visit: http://localhost:8000/docs
   - Interactive API testing interface

---

## 💡 Tips

- **Keep backend running** while using extension
- **Use virtual environment** to avoid conflicts
- **Check logs** in terminal for debugging
- **API docs** at `/docs` for testing endpoints

---

## 🎉 Success!

If you see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Your backend is running successfully! 🎉

Now you can:
- Use the Chrome extension
- Test API endpoints
- View API documentation
- Scan URLs automatically
