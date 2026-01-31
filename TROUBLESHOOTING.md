# Troubleshooting Guide

## ❌ Error: "Cannot connect to backend API: TypeError: Failed to fetch"

This error means the browser extension cannot reach the backend server. Follow these steps:

### ✅ Solution 1: Start the Backend Server

**The most common cause is that the backend server is not running.**

1. **Open a terminal/command prompt**

2. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

3. **Start the server:**
   ```bash
   python main.py
   ```

4. **Verify it's running:**
   - You should see: `Uvicorn running on http://0.0.0.0:8000`
   - Open browser and go to: `http://localhost:8000/health`
   - You should see: `{"status":"healthy","ml_model_loaded":false}`

5. **Keep the terminal window open** - the server must keep running!

6. **Reload the extension:**
   - Go to `chrome://extensions/`
   - Click the refresh icon on the extension card
   - Or remove and re-add the extension

### ✅ Solution 2: Check if Port 8000 is Available

If port 8000 is already in use:

1. **Find what's using port 8000:**
   ```bash
   # Windows:
   netstat -ano | findstr :8000
   
   # Linux/Mac:
   lsof -i :8000
   ```

2. **Change the port in backend/main.py:**
   ```python
   uvicorn.run(
       "main:app",
       host="0.0.0.0",
       port=8001,  # Change to 8001 or any available port
       reload=True
   )
   ```

3. **Update extension/background.js:**
   ```javascript
   const API_BASE_URL = 'http://localhost:8001';  // Match the new port
   ```

4. **Reload the extension**

### ✅ Solution 3: Check Firewall/Antivirus

Sometimes firewalls block localhost connections:

1. **Temporarily disable firewall** to test
2. **Add exception** for Python/uvicorn
3. **Check Windows Defender** or antivirus settings

### ✅ Solution 4: Verify Backend is Accessible

Test the backend directly:

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test scan endpoint
curl -X POST "http://localhost:8000/scan-url" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'
```

If these fail, the backend isn't running correctly.

### ✅ Solution 5: Check Browser Console

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Look for detailed error messages**
4. **Check Network tab** to see if requests are being made

### ✅ Solution 6: Verify Extension Permissions

Make sure the extension has the right permissions in `manifest.json`:

```json
"host_permissions": [
  "http://localhost:8000/*",
  "https://*/*",
  "http://*/*"
]
```

---

## 🔍 Quick Diagnostic Checklist

- [ ] Backend server is running (`python main.py`)
- [ ] Can access `http://localhost:8000/health` in browser
- [ ] Port 8000 is not blocked by firewall
- [ ] Extension is reloaded after backend starts
- [ ] No other application is using port 8000
- [ ] Python dependencies are installed (`pip install -r requirements.txt`)

---

## 🛠️ Common Issues

### Issue: "ModuleNotFoundError" when starting backend

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### Issue: Backend starts but immediately crashes

**Solution:**
- Check Python version: `python --version` (needs 3.8+)
- Check for syntax errors in code
- Review terminal output for specific error messages

### Issue: Extension loads but shows no results

**Solution:**
1. Check browser console (F12) for errors
2. Verify backend is running
3. Try scanning a simple URL like `https://www.google.com`
4. Check Network tab in DevTools to see API requests

### Issue: CORS errors in console

**Solution:**
- CORS is already enabled in the backend
- Make sure you're using `http://localhost:8000` (not `https://`)
- Check that `allow_origins=["*"]` is in `main.py`

---

## 📞 Still Having Issues?

1. **Check the terminal** where backend is running for error messages
2. **Check browser console** (F12) for detailed errors
3. **Verify all files are in correct locations**
4. **Try restarting both backend and browser**

---

## ✅ Quick Test

Run this to verify everything works:

```bash
# Terminal 1: Start backend
cd backend
python main.py

# Terminal 2: Test API
curl http://localhost:8000/health
```

If the health check works, the backend is fine. Then reload the extension.
