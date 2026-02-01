# Push Project to GitHub - Quick Guide

## ✅ Current Status

- ✅ Git repository initialized
- ✅ All files committed (39 files)
- ✅ Remote repository configured
- ⚠️ Need authentication to push

## 🔐 Authenticate and Push

### Step 1: Get Personal Access Token

1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name: `Malicious-URL-Detection`
4. Expiration: Choose your preference (90 days recommended)
5. Select scope: ✅ **repo** (Full control of private repositories)
6. Click **"Generate token"**
7. **Copy the token immediately** (you won't see it again!)

### Step 2: Push to GitHub

Run this command:

```bash
cd "M:\project\url dection"
git push -u origin main
```

**When prompted:**
- **Username**: `manividyadhar`
- **Password**: **Paste your Personal Access Token** (not your GitHub password!)

### Alternative: Use Token in URL

If the above doesn't work, use token directly:

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/manividyadhar/Malicious-URL-Detection.git
git push -u origin main
```

Replace `YOUR_TOKEN` with your actual token.

## 📦 What Will Be Pushed

- ✅ Backend (Python FastAPI)
- ✅ Chrome Extension (Manifest V3)
- ✅ All documentation
- ✅ Configuration files
- ✅ Test files

## 🎯 After Successful Push

Visit: **https://github.com/manividyadhar/Malicious-URL-Detection**

You should see all your project files!

## 💡 Quick Commands

```bash
# Check status
git status

# View commits
git log --oneline

# Push (after authentication)
git push -u origin main

# If you need to force push (be careful!)
# git push -u origin main --force
```

## 🔍 Verify

After push, check your repository:
- All files should be visible
- README.md should be at the root
- Backend and extension folders should be there

---

**Note**: If you get authentication errors, make sure:
1. Token has `repo` scope
2. Token hasn't expired
3. You're using the token, not password
