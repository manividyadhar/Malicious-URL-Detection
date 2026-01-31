# Setup Guide - Step by Step

## Current Status
✅ pip is installed (version 26.0)
⚠️ PATH warning (optional to fix, but recommended)

---

## Step 1: Fix PATH Warning (Optional but Recommended)

The warning says pip scripts are not in PATH. You have two options:

### Option A: Add to PATH (Recommended)

1. **Copy the path from the warning:**
   ```
   C:\Users\maniv\AppData\Roaming\Python\Python314\Scripts
   ```

2. **Add to PATH:**
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Click "Environment Variables"
   - Under "User variables", find "Path" and click "Edit"
   - Click "New" and paste the path above
   - Click OK on all windows
   - **Restart your terminal/IDE**

3. **Verify it works:**
   ```bash
   pip --version
   ```

### Option B: Use Python -m pip (No PATH needed)

You can always use:
```bash
python -m pip install ...
```
instead of just `pip install ...`

---

## Step 2: Install Project Dependencies

Now install the required packages for the backend:

```bash
# Navigate to backend folder
cd backend

# Install all dependencies
pip install -r requirements.txt
```

Or if pip is not in PATH:
```bash
python -m pip install -r requirements.txt
```

**Expected output:** You should see packages being installed:
- fastapi
- uvicorn
- pydantic
- scikit-learn
- numpy
- etc.

---

## Step 3: Start the Backend Server

Once dependencies are installed:

```bash
# Make sure you're in the backend folder
cd backend

# Start the server
python main.py
```

**You should see:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**Keep this terminal open!** The server must keep running.

---

## Step 4: Verify Backend is Working

Open a new terminal (keep the server running) and test:

```bash
# Test health endpoint
curl http://localhost:8000/health
```

Or open in browser:
```
http://localhost:8000/health
```

You should see: `{"status":"healthy","ml_model_loaded":false}`

---

## Step 5: Install Browser Extension

1. **Chrome/Edge:**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` folder

2. **Reload the extension** after backend starts

---

## Step 6: Test Everything

1. **Click the extension icon**
2. **Click "Scan Current Page"**
3. **You should see results!**

---

## Quick Command Reference

```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Start server
python main.py

# Test backend (in another terminal)
python check_backend.py
```

---

## Troubleshooting

### "pip is not recognized"
- Use: `python -m pip install -r requirements.txt`
- Or fix PATH (see Step 1)

### "Module not found" when running main.py
- Make sure you installed requirements: `pip install -r requirements.txt`
- Check you're in the `backend` folder

### "Port 8000 already in use"
- Close other applications using port 8000
- Or change port in `backend/main.py`

### Extension still shows connection error
- Make sure backend is running (`python main.py`)
- Verify: `http://localhost:8000/health` works
- Reload the extension

---

## Next Steps After Setup

1. ✅ Backend running
2. ✅ Extension installed
3. ✅ Test scanning URLs
4. Read `HOW_TO_USE.md` for detailed usage
5. Check `TROUBLESHOOTING.md` if issues occur
