# How to Use the Malicious URL Detection System

## 🚀 Step-by-Step Usage Guide

### Part 1: Start the Backend Server

1. **Open a terminal/command prompt** and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. **Install Python dependencies** (first time only):
   ```bash
   pip install -r requirements.txt
   ```
   
   If you prefer using a virtual environment (recommended):
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate it
   # Windows:
   venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate
   
   # Then install dependencies
   pip install -r requirements.txt
   ```

3. **Start the backend server**:
   ```bash
   python main.py
   ```
   
   You should see output like:
   ```
   INFO:     Started server process
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

4. **Verify it's working**:
   - Open your browser and go to: `http://localhost:8000/docs`
   - You should see the API documentation (Swagger UI)
   - Or test with: `http://localhost:8000/health`

**Keep this terminal window open** - the server needs to keep running!

---

### Part 2: Install the Browser Extension

#### For Chrome/Edge:

1. **Open Chrome/Edge** and go to:
   ```
   chrome://extensions/
   ```
   (or `edge://extensions/` for Edge)

2. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the extension**:
   - Click "Load unpacked" button
   - Navigate to and select the `extension` folder
   - Click "Select Folder"

4. **Verify installation**:
   - You should see "Malicious URL Detector" in your extensions list
   - The extension icon should appear in your browser toolbar

#### For Firefox:

1. **Open Firefox** and go to:
   ```
   about:debugging
   ```

2. **Click "This Firefox"** in the left sidebar

3. **Load the extension**:
   - Click "Load Temporary Add-on"
   - Navigate to the `extension` folder
   - Select `manifest.json`
   - Click "Open"

---

### Part 3: Using the Extension

#### Method 1: Scan Current Page

1. **Visit any website** (e.g., `https://www.google.com`)

2. **Click the extension icon** in your browser toolbar

3. **Click "Scan Current Page"** button

4. **View the results**:
   - Risk Score (0-100)
   - Verdict (Safe/Suspicious/Malicious)
   - Detailed reasons for the score

#### Method 2: Scan Custom URL

1. **Click the extension icon**

2. **Type or paste a URL** in the input field (e.g., `https://example.com`)

3. **Click "Scan URL"** button

4. **Review the analysis results**

#### Method 3: Automatic Protection

- The extension **automatically scans** URLs when you navigate to new pages
- If a malicious URL is detected, you'll see a **browser notification**
- Warnings are shown for URLs with risk scores ≥ 60

---

### Part 4: Using the API Directly

#### Option A: Using cURL (Command Line)

**Scan a URL:**
```bash
curl -X POST "http://localhost:8000/scan-url" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\": \"https://www.google.com\"}"
```

**Or using GET method:**
```bash
curl "http://localhost:8000/scan-url?url=https://www.google.com"
```

**Health check:**
```bash
curl http://localhost:8000/health
```

#### Option B: Using Python

Create a file `test_scan.py`:
```python
import requests

# Scan a URL
response = requests.post(
    "http://localhost:8000/scan-url",
    json={"url": "https://www.google.com"}
)

result = response.json()
print(f"URL: {result['url']}")
print(f"Risk Score: {result['risk_score']}/100")
print(f"Verdict: {result['verdict']}")
print(f"Reasons: {result['reasons']}")
```

Run it:
```bash
python test_scan.py
```

#### Option C: Using Browser (Swagger UI)

1. **Go to**: `http://localhost:8000/docs`

2. **Click on** `/scan-url` endpoint

3. **Click "Try it out"**

4. **Enter a URL** in the request body:
   ```json
   {
     "url": "https://www.google.com"
   }
   ```

5. **Click "Execute"**

6. **View the response** below

---

### Part 5: Test with Sample URLs

Use the test script included:

```bash
cd backend
python test_api.py
```

This will test multiple URLs and show you the results.

Or test manually with URLs from `test_urls.txt`:

**Safe URL:**
```bash
curl -X POST "http://localhost:8000/scan-url" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'
```

**Suspicious URL:**
```bash
curl -X POST "http://localhost:8000/scan-url" \
  -H "Content-Type: application/json" \
  -d '{"url": "http://account-suspended.notify.com/verify"}'
```

**Malicious URL:**
```bash
curl -X POST "http://localhost:8000/scan-url" \
  -H "Content-Type: application/json" \
  -d '{"url": "http://192.168.1.1/login/verify/account"}'
```

---

## 📊 Understanding the Results

### Risk Score Ranges:
- **0-29**: Safe ✅
- **30-69**: Suspicious ⚠️
- **70-100**: Malicious 🚨

### Example Response:
```json
{
  "url": "https://www.google.com",
  "risk_score": 5,
  "verdict": "safe",
  "reasons": [
    "No suspicious patterns detected"
  ],
  "ml_confidence": null,
  "processing_time_ms": 8.45
}
```

---

## 🔧 Troubleshooting

### Backend Issues:

**Problem**: "Cannot connect to API"
- **Solution**: Make sure the backend server is running (`python main.py`)
- Check if port 8000 is available
- Verify you're using `http://localhost:8000`

**Problem**: "Module not found" errors
- **Solution**: Install dependencies: `pip install -r requirements.txt`
- Make sure you're in the `backend` directory

**Problem**: Port already in use
- **Solution**: Change the port in `main.py`:
  ```python
  uvicorn.run("main:app", host="0.0.0.0", port=8001)  # Use different port
  ```

### Extension Issues:

**Problem**: Extension shows "Cannot connect to API"
- **Solution**: 
  1. Make sure backend is running
  2. Check `background.js` - verify `API_BASE_URL` is `http://localhost:8000`
  3. Check browser console (F12) for errors

**Problem**: Extension not loading
- **Solution**:
  - Make sure Developer Mode is enabled
  - Check for errors in the extensions page
  - Verify all files are in the `extension` folder

**Problem**: No results showing
- **Solution**:
  - Check browser console (F12 → Console tab)
  - Verify backend is accessible
  - Try scanning a simple URL like `https://www.google.com`

---

## 💡 Tips

1. **Keep backend running**: The extension needs the backend server to be running at all times

2. **Test different URLs**: Try safe, suspicious, and malicious URLs to see how the system responds

3. **Check API docs**: Visit `http://localhost:8000/docs` for interactive API testing

4. **Monitor console**: Use browser DevTools (F12) to see extension logs and errors

5. **Batch scanning**: Use the Python API to scan multiple URLs programmatically

---

## 🎯 Common Use Cases

### 1. Quick URL Check
- Open extension popup → Enter URL → Click Scan

### 2. Check Current Page
- Navigate to a page → Click extension → Click "Scan Current Page"

### 3. Programmatic Scanning
- Use Python/JavaScript to integrate into your applications

### 4. Link Monitoring
- Extension automatically warns when clicking suspicious links

---

## 📝 Next Steps

- Read `README.md` for detailed documentation
- Check `api_examples.md` for more code examples
- Train an ML model (see `backend/scanner/model.py`)
- Customize heuristic rules (see `backend/scanner/heuristics.py`)

---

**Need help?** Check the main `README.md` file or review the code comments for more details!
