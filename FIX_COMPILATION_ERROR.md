# Fix: Cython Compilation Error

## Problem
You're getting a Cython compilation error when installing scikit-learn. This happens because:
- Windows doesn't have the C++ build tools needed to compile from source
- The package is trying to build from source instead of using pre-built wheels

## ✅ Quick Fix: Use Pre-built Wheels

The easiest solution is to install pre-built packages (wheels) instead of compiling:

### Option 1: Install with Pre-built Wheels (Recommended)

```bash
# Cancel current installation (Ctrl+C if still running)

# Install with only pre-built packages
pip install --only-binary :all: -r requirements.txt
```

This forces pip to use pre-compiled Windows packages.

### Option 2: Install Packages Individually with Wheels

```bash
# Install core packages first (these should work)
pip install fastapi uvicorn pydantic python-multipart

# Install numpy (usually has pre-built wheels)
pip install numpy

# Try scikit-learn with pre-built wheel
pip install --only-binary scikit-learn scikit-learn
```

### Option 3: Skip ML Model for Now (Fastest)

If you just want to test the system without ML features:

```bash
# Install only what's needed for basic functionality
pip install fastapi uvicorn pydantic python-multipart
```

The system will work in "heuristic-only" mode (no ML model).

Then modify `backend/main.py` to skip ML model loading:
- The code already handles this gracefully
- It will just use heuristic scoring

### Option 4: Install Build Tools (If you need to compile)

If you really need to compile from source:

1. **Install Visual Studio Build Tools:**
   - Download: https://visualstudio.microsoft.com/downloads/
   - Install "Desktop development with C++" workload
   - Restart computer
   - Try installing again

2. **Or use conda instead of pip:**
   ```bash
   conda install scikit-learn numpy
   pip install fastapi uvicorn pydantic python-multipart
   ```

## 🎯 Recommended Solution

**Try this first:**

```bash
# 1. Cancel current install (Ctrl+C)

# 2. Clear pip cache (optional)
pip cache purge

# 3. Install with pre-built wheels only
pip install --only-binary :all: fastapi uvicorn[standard] pydantic scikit-learn numpy python-multipart
```

## ✅ Verify Installation

After installation, test:

```bash
python -c "import fastapi; print('FastAPI: OK')"
python -c "import sklearn; print('Scikit-learn: OK')"
```

If both work, you're good to go!

## 🚀 Start the Backend

Once packages are installed:

```bash
cd backend
python main.py
```

The system will work even if scikit-learn installation failed (it will just use heuristic-only mode).
