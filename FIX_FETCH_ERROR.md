# Fix: "Failed to fetch" Error - Complete Solution

## 🔍 Root Causes Identified

### 1. **CORS Configuration Conflict** ⚠️ CRITICAL
   - **Problem**: `allow_credentials=True` with `allow_origins=["*"]` is **blocked by browsers**
   - **Why**: Browsers prevent credentials with wildcard origins for security
   - **Fix**: Set `allow_credentials=False` and specify exact origins

### 2. **Missing Timeout Handling**
   - **Problem**: Fetch requests could hang indefinitely
   - **Fix**: Added `AbortController` with timeout

### 3. **No Retry Logic**
   - **Problem**: If localhost fails, no fallback to 127.0.0.1
   - **Fix**: Added automatic retry with alternative URLs

### 4. **Insufficient Error Logging**
   - **Problem**: Hard to diagnose what went wrong
   - **Fix**: Added comprehensive error logging with troubleshooting hints

### 5. **Missing 127.0.0.1 Permission**
   - **Problem**: Extension might need explicit permission for 127.0.0.1
   - **Fix**: Added to `host_permissions` in manifest.json

---

## ✅ What Was Fixed

### Backend (`backend/main.py`)

1. **Fixed CORS Configuration:**
   ```python
   # BEFORE (BROKEN):
   allow_origins=["*"]
   allow_credentials=True  # ❌ Conflict!
   
   # AFTER (FIXED):
   allow_origins=[
       "http://localhost:8000",
       "http://127.0.0.1:8000",
       "chrome-extension://*",
       "moz-extension://*",
   ]
   allow_credentials=False  # ✅ Fixed!
   ```

2. **Explicit Methods and Headers:**
   - Specified exact HTTP methods: `["GET", "POST", "OPTIONS"]`
   - Specified exact headers: `["Content-Type", "Accept", "Origin"]`
   - Added `max_age=3600` for preflight caching

### Extension (`extension/background.js`)

1. **Added Timeout Handling:**
   ```javascript
   const REQUEST_TIMEOUT = 10000; // 10 seconds
   const { controller, timeoutId } = createTimeoutController(REQUEST_TIMEOUT);
   ```

2. **Added Retry Logic:**
   - Tries `localhost:8000` first
   - Falls back to `127.0.0.1:8000` if localhost fails
   - Logs which URL succeeded

3. **Improved Error Handling:**
   - Detailed error messages
   - Specific error types (timeout, network, CORS)
   - Troubleshooting hints in console

4. **Fixed Fetch Options:**
   ```javascript
   credentials: 'omit',  // Don't send credentials (matches backend)
   mode: 'cors',        // Explicitly set CORS mode
   ```

### Manifest (`extension/manifest.json`)

1. **Added 127.0.0.1 Permission:**
   ```json
   "host_permissions": [
     "http://localhost:8000/*",
     "http://127.0.0.1:8000/*",  // ✅ Added
     ...
   ]
   ```

---

## 🧪 Verification Steps

### Step 1: Verify Backend is Running

```bash
# Start backend
cd backend
python main.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Test Backend Directly

Open browser and visit:
- `http://localhost:8000/health`
- `http://127.0.0.1:8000/health`

Both should return: `{"status":"healthy","ml_model_loaded":false}`

### Step 3: Test CORS with cURL

```bash
# Test OPTIONS (preflight) request
curl -X OPTIONS http://localhost:8000/scan-url \
  -H "Origin: chrome-extension://test" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Should see CORS headers in response
```

### Step 4: Reload Extension

1. Go to `chrome://extensions/`
2. Find "Malicious URL Detector"
3. Click the **refresh/reload** icon
4. Check console for health check message

### Step 5: Test Extension

1. Click extension icon
2. Click "Scan Current Page"
3. Check browser console (F12 → Console)
4. Should see: `✅ Successfully connected to: http://localhost:8000`

---

## 🔍 Debugging Checklist

If you still get "Failed to fetch":

### ✅ Backend Checklist
- [ ] Backend server is running (`python main.py`)
- [ ] Can access `http://localhost:8000/health` in browser
- [ ] CORS middleware is configured correctly
- [ ] No firewall blocking port 8000

### ✅ Extension Checklist
- [ ] Extension is reloaded after changes
- [ ] `host_permissions` includes both localhost and 127.0.0.1
- [ ] Check browser console (F12) for detailed errors
- [ ] Check Network tab in DevTools to see failed requests

### ✅ Browser Console Messages

**Good signs:**
```
✅ Backend API is healthy at http://localhost:8000
✅ Successfully connected to: http://localhost:8000
```

**Bad signs:**
```
❌ Cannot connect to backend API
⏱️ Request timeout
🌐 Network error connecting to...
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution:**
- Verify CORS middleware is in `main.py`
- Check that `allow_origins` includes extension origins
- Ensure `allow_credentials=False` when using wildcards

### Issue 2: "Failed to fetch" with no details

**Solution:**
- Check if backend is running
- Verify port 8000 is not blocked
- Check browser console for detailed error
- Try `127.0.0.1` instead of `localhost`

### Issue 3: Request hangs/timeout

**Solution:**
- Backend might be slow or stuck
- Check backend terminal for errors
- Increase timeout in `background.js` if needed
- Verify backend is responding to direct requests

### Issue 4: Works in browser but not extension

**Solution:**
- Extension needs explicit `host_permissions`
- Service worker might be terminated
- Check extension console (not page console)
- Reload extension after changes

---

## 📊 Testing the Fix

### Test Script

Run this to verify everything works:

```bash
# Terminal 1: Start backend
cd backend
python main.py

# Terminal 2: Test API
python check_backend.py
```

### Manual Test

1. **Start backend** (keep running)
2. **Reload extension**
3. **Open extension popup**
4. **Click "Scan Current Page"**
5. **Check results** - should show risk score and verdict

### Expected Console Output

```
🏥 Health check: http://localhost:8000/health
✅ Backend API is healthy at http://localhost:8000
   Status: healthy
🔍 Attempting to connect to: http://localhost:8000
✅ Successfully connected to: http://localhost:8000
```

---

## 🎯 Summary

**Main Fix:** CORS configuration conflict resolved
- Changed `allow_credentials=True` to `False`
- Specified exact origins instead of wildcard
- Added proper CORS headers

**Additional Improvements:**
- Timeout handling (10 seconds)
- Retry logic (localhost → 127.0.0.1)
- Better error messages
- Comprehensive logging

**Result:** Extension should now successfully communicate with backend API! 🎉

---

## 📝 Files Modified

1. ✅ `backend/main.py` - Fixed CORS configuration
2. ✅ `extension/background.js` - Added timeout, retry, better errors
3. ✅ `extension/manifest.json` - Added 127.0.0.1 permission

All changes are production-safe and follow Chrome Manifest V3 standards.
