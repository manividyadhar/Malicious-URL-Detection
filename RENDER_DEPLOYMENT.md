# Render Deployment Guide

## ✅ Fixed Requirements

All dependencies have been updated to **stable versions** compatible with Python 3.10.13 and Render Free tier.

### Changes Made

1. **Removed `[standard]` from uvicorn** - Avoids uvloop and native extensions that can fail on Render
2. **Pinned all versions** - No flexible ranges that could pull RC/beta versions
3. **Python 3.10 compatible** - All packages tested with Python 3.10.13
4. **Stable versions only** - No RC, beta, or alpha releases

## 🚀 Render Configuration

### Option 1: Using render.yaml (Recommended)

The `render.yaml` file is already configured. Just connect your GitHub repo to Render.

### Option 2: Manual Configuration

**Build Command:**
```bash
pip install -r backend/requirements.txt
```

**Start Command:**
```bash
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Environment Variables:**
- `PYTHON_VERSION`: `3.10.13`

**Health Check Path:**
- `/health`

## 📋 Render Service Settings

1. **Service Type:** Web Service
2. **Environment:** Python 3
3. **Build Command:** `pip install -r backend/requirements.txt`
4. **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Python Version:** 3.10.13
6. **Root Directory:** (leave empty, or set to project root)

## 🔍 Why Previous Build Failed

**Issue 1:** `numpy==2.0.0rc1` - Release candidate version not available on PyPI for Python 3.10
**Issue 2:** `uvicorn[standard]` - Includes uvloop which requires native compilation, can fail on Render
**Issue 3:** Python 3.13 incompatibility - Some packages don't have wheels for 3.13 yet

**Why This Fix Works:**
- All versions are stable releases available on PyPI
- uvicorn without `[standard]` avoids native extensions
- Python 3.10.13 has full package support with pre-built wheels
- Explicit version pinning prevents pulling RC/beta versions

## ✅ Verification

After deployment, test:
- Health check: `https://your-app.onrender.com/health`
- API docs: `https://your-app.onrender.com/docs`
- Scan endpoint: `https://your-app.onrender.com/scan-url`

## 🔧 Troubleshooting

### Build Fails

1. Check Python version is 3.10.13
2. Verify build command: `pip install -r backend/requirements.txt`
3. Check build logs for specific package errors

### Runtime Errors

1. Verify start command includes `--host 0.0.0.0`
2. Check that `$PORT` environment variable is used
3. Ensure health check path is `/health`

### Import Errors

All imports in `main.py` are compatible with the updated versions:
- ✅ fastapi 0.110.0
- ✅ pydantic 2.6.4
- ✅ uvicorn 0.29.0
- ✅ scikit-learn 1.4.2
- ✅ numpy 1.26.4

## 📝 Notes

- Render Free tier has build time limits (15 minutes)
- First build may take longer (5-10 minutes)
- Subsequent builds are faster due to caching
- Health checks help Render know when service is ready
