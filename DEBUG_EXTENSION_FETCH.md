# Debug Guide: Extension Fetch Error

## 🔍 Step-by-Step Debugging

### Step 1: Verify Backend is Running

```bash
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
- `http://localhost:8000/docs`

Both should work. If not, backend isn't running correctly.

### Step 3: Test CORS from Browser

Open `test_extension_fetch.html` in your browser and click all test buttons.

All should show ✅ success. If any fail, CORS is misconfigured.

### Step 4: Check Extension Service Worker Console

1. Go to `chrome://extensions/`
2. Find "Malicious URL Detector"
3. Click **"service worker"** link (or "Inspect views: service worker")
4. This opens the service worker DevTools console
5. Look for error messages

**Good signs:**
```
✅ Backend API is healthy at http://localhost:8000
✅ Successfully connected to: http://localhost:8000
```

**Bad signs:**
```
❌ Cannot connect to backend API
🌐 Network error connecting to...
⏱️ Request timeout
```

### Step 5: Check Network Tab

1. In service worker DevTools, go to **Network** tab
2. Try scanning a URL from extension popup
3. Look for the request to `/scan-url`
4. Check:
   - **Status**: Should be 200
   - **Type**: Should be `xhr` or `fetch`
   - **Headers**: Check Request and Response headers

**If request shows:**
- **Red/failed**: Backend not reachable
- **CORS error**: Check CORS headers in Response
- **404**: Wrong URL or endpoint
- **500**: Backend error (check backend terminal)

### Step 6: Verify Manifest Permissions

Check `extension/manifest.json`:

```json
"host_permissions": [
  "http://localhost:8000/*",
  "http://127.0.0.1:8000/*"
]
```

**After changing manifest:**
1. Go to `chrome://extensions/`
2. Click **reload** icon on extension
3. Test again

### Step 7: Check Backend CORS Logs

In backend terminal, you should see:
```
INFO:     127.0.0.1:xxxxx - "OPTIONS /scan-url HTTP/1.1" 200 OK
INFO:     127.0.0.1:xxxxx - "POST /scan-url HTTP/1.1" 200 OK
```

If you see OPTIONS but not POST, CORS preflight is working but POST is failing.

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to fetch" with no details

**Cause:** Service worker can't reach backend

**Solutions:**
1. Verify backend is running: `http://localhost:8000/health`
2. Check firewall isn't blocking port 8000
3. Try `127.0.0.1` instead of `localhost`
4. Check service worker console for detailed error

### Issue 2: CORS policy error

**Cause:** Backend CORS not configured correctly

**Solution:**
- Verify `allow_credentials=False` in backend
- Check `allow_origins=["*"]` or specific origins
- Ensure OPTIONS endpoint exists

### Issue 3: Request hangs/timeout

**Cause:** Backend is slow or stuck

**Solutions:**
1. Check backend terminal for errors
2. Test endpoint directly in browser
3. Increase timeout in `background.js` if needed

### Issue 4: Works in browser but not extension

**Cause:** Extension permissions or service worker issue

**Solutions:**
1. Reload extension after changes
2. Check `host_permissions` in manifest
3. Verify service worker is active (not terminated)
4. Check service worker console (not page console)

### Issue 5: Service worker terminated

**Cause:** Chrome terminates idle service workers

**Solution:**
- This is normal behavior
- Extension will restart service worker when needed
- Add `chrome.runtime.onStartup` listener to reconnect

## ✅ Verification Checklist

- [ ] Backend running (`python main.py`)
- [ ] `http://localhost:8000/health` works in browser
- [ ] `test_extension_fetch.html` all tests pass
- [ ] Extension reloaded after changes
- [ ] Service worker console shows no errors
- [ ] Network tab shows successful requests
- [ ] Backend terminal shows incoming requests
- [ ] CORS headers present in response

## 📊 Expected Console Output

### Service Worker Console (Good):
```
🏥 Health check: http://localhost:8000/health
✅ Backend API is healthy at http://localhost:8000
   Status: healthy
🔍 Attempting to connect to: http://localhost:8000
📤 Sending POST to http://localhost:8000/scan-url
✅ Successfully connected to: http://localhost:8000
```

### Service Worker Console (Bad):
```
❌ Cannot connect to backend API on any URL
💡 Make sure the backend server is running:
   1. Open terminal
   2. cd backend
   3. python main.py
   4. Verify in browser: http://localhost:8000/health
   5. Check firewall/antivirus settings
```

## 🎯 Final Test

1. **Start backend**: `python main.py`
2. **Reload extension**: `chrome://extensions/` → reload
3. **Open extension popup**: Click extension icon
4. **Scan URL**: Click "Scan Current Page"
5. **Check results**: Should show risk score and verdict

If all steps pass, the extension should work! 🎉
