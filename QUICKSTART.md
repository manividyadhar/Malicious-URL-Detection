# Quick Start Guide

Get the Malicious URL Detection System up and running in 5 minutes!

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

The API will be running at `http://localhost:8000`

**Verify it's working:**
```bash
curl http://localhost:8000/health
```

Or open in browser: `http://localhost:8000/docs`

## Step 2: Browser Extension Setup (2 minutes)

### Chrome/Edge:

1. Open `chrome://extensions/` (or `edge://extensions/`)
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the `extension` folder
5. The extension icon should appear in your toolbar

### Firefox:

1. Open `about:debugging`
2. Click **This Firefox**
3. Click **Load Temporary Add-on**
4. Select `extension/manifest.json`

## Step 3: Test It! (1 minute)

### Test via Browser Extension:

1. Click the extension icon
2. Click **"Scan Current Page"** or enter a URL
3. View the results!

### Test via API:

```bash
# Test a safe URL
curl -X POST "http://localhost:8000/scan-url" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'

# Test a suspicious URL
curl -X POST "http://localhost:8000/scan-url" \
  -H "Content-Type: application/json" \
  -d '{"url": "http://192.168.1.1/login/verify"}'
```

### Test via Python Script:

```bash
cd backend
python test_api.py
```

## Troubleshooting

### Backend won't start:
- Make sure Python 3.8+ is installed
- Check if port 8000 is already in use
- Verify all dependencies are installed: `pip install -r requirements.txt`

### Extension not working:
- Make sure backend is running on `http://localhost:8000`
- Check browser console for errors (F12)
- Verify extension is enabled in browser

### API connection errors:
- Ensure backend is running
- Check firewall settings
- Verify CORS is enabled (it is by default)

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [api_examples.md](api_examples.md) for more API usage examples
- Test with URLs from [test_urls.txt](test_urls.txt)
- Train an ML model (see README.md for instructions)

## Need Help?

- Check the main README.md for detailed information
- Review API documentation at `http://localhost:8000/docs`
- Check browser console for extension errors

Happy scanning! 🛡️
