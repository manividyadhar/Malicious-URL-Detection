# Deployment Guide

Complete deployment instructions for the Malicious URL Detection system.

---

## 🚀 Quick Deploy to Render

### **Prerequisites**
- GitHub account
- Render account (free tier works)
- Code pushed to GitHub repository

### **One-Click Deploy**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`

3. **Deploy:**
   - Click "Apply"
   - Wait for build to complete (~5-10 minutes)
   - Your app will be live at: `https://malicious-url-detection.onrender.com`

---

## 📋 Render Configuration

### **Service Details**

**Service Name:** `malicious-url-detection`  
**Type:** Web Service  
**Environment:** Node.js  
**Plan:** Free  
**Region:** Oregon  

### **Build Command**
```bash
npm install
cd shared && npm install && npm run build
cd ../server && npm install && npm run build
cd ../client && npm install && npm run build
```

**What it does:**
1. Installs root dependencies
2. Builds shared detection engine
3. Builds Express server
4. Builds React frontend

### **Start Command**
```bash
cd server && npm start
```

**What it does:**
- Starts Express server on port assigned by Render
- Serves API endpoints at `/api/*`
- Serves frontend static files at `/*` (production only)

### **Environment Variables**

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Enables production mode |
| `PORT` | (auto) | Assigned by Render |

### **Health Check**
- **Path:** `/api/health`
- **Expected Response:** `200 OK`

---

## 🏗️ Build Process

### **Step-by-Step**

1. **Install Root Dependencies**
   ```bash
   npm install
   ```

2. **Build Shared Library**
   ```bash
   cd shared
   npm install
   npm run build
   # Output: shared/dist/
   ```

3. **Build Server**
   ```bash
   cd server
   npm install
   npm run build
   # Output: server/dist/
   ```

4. **Build Client**
   ```bash
   cd client
   npm install
   npm run build
   # Output: client/dist/
   ```

5. **Start Server**
   ```bash
   cd server
   npm start
   # Runs: node dist/index.js
   ```

---

## 🌐 Production Architecture

```
┌─────────────────────────────────────────┐
│         Render Web Service              │
│  (malicious-url-detection.onrender.com) │
└─────────────────────────────────────────┘
                    │
                    ├─── /api/*  ──────► Express API
                    │                     (server/dist/)
                    │
                    └─── /*  ─────────► React SPA
                                        (client/dist/)
```

### **Request Routing**

| Path | Handler | Description |
|------|---------|-------------|
| `/api/health` | API | Health check endpoint |
| `/api/check-url` | API | URL analysis endpoint |
| `/` | Frontend | Landing page |
| `/about` | Frontend | About page |
| `/*` | Frontend | SPA fallback (index.html) |

---

## 🔧 Local Development

### **Development Mode**

```bash
# Terminal 1: Start API server
cd server
npm run dev
# Runs on http://localhost:5000

# Terminal 2: Start frontend
cd client
npm run dev
# Runs on http://localhost:3000
# API calls proxy to localhost:5000
```

### **Production Mode (Local)**

```bash
# Build everything
npm run build

# Start server
npm start
# Runs on http://localhost:5000
# Serves both API and frontend
```

---

## 📦 Node.js Version

### **Required Version**
- **Node.js:** >= 18.0.0
- **npm:** >= 9.0.0

### **Render Configuration**

Render automatically detects Node.js version from:
1. `package.json` engines field
2. `.node-version` file (if present)
3. `.nvmrc` file (if present)

**Current configuration** (in root `package.json`):
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

---

## 🔍 Verification

### **After Deployment**

1. **Check Health:**
   ```bash
   curl https://malicious-url-detection.onrender.com/api/health
   ```
   Expected: `{"status":"healthy",...}`

2. **Test API:**
   ```bash
   curl -X POST https://malicious-url-detection.onrender.com/api/check-url \
     -H "Content-Type: application/json" \
     -d '{"url":"https://google.com"}'
   ```
   Expected: `{"verdict":"safe",...}`

3. **Visit Frontend:**
   - Open: `https://malicious-url-detection.onrender.com`
   - Should see landing page
   - Test URL scanner

---

## 🐛 Troubleshooting

### **Build Fails**

**Check build logs:**
- Go to Render Dashboard
- Click on service
- View "Logs" tab
- Look for errors in build output

**Common issues:**
- Missing dependencies: Check `package.json` files
- TypeScript errors: Run `npm run build` locally first
- Out of memory: Upgrade Render plan

### **Server Won't Start**

**Check runtime logs:**
- View "Logs" tab in Render Dashboard
- Look for startup errors

**Common issues:**
- Port binding: Ensure using `process.env.PORT`
- Missing files: Check build output includes all files
- Environment variables: Verify `NODE_ENV=production`

### **Frontend Not Loading**

**Check:**
1. Build created `client/dist/` folder
2. Server serves static files in production
3. `NODE_ENV=production` is set
4. Check browser console for errors

**Debug:**
```bash
# Local production test
NODE_ENV=production npm start
# Visit http://localhost:5000
```

### **API Calls Failing**

**Check:**
1. CORS configuration allows requests
2. API endpoints return 200 status
3. Request/response format matches

**Test:**
```bash
# Health check
curl https://your-app.onrender.com/api/health

# URL check
curl -X POST https://your-app.onrender.com/api/check-url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

---

## 📊 Monitoring

### **Render Dashboard**

Monitor:
- **Logs:** Real-time application logs
- **Metrics:** CPU, memory, bandwidth usage
- **Events:** Deployments, restarts, errors

### **Health Checks**

Render automatically pings `/api/health` every 30 seconds:
- ✅ Returns 200: Service healthy
- ❌ Returns error: Service restarted

---

## 🔄 Updates & Redeployment

### **Automatic Deployment**

Render auto-deploys on git push:
```bash
git add .
git commit -m "Update feature"
git push origin main
# Render automatically rebuilds and deploys
```

### **Manual Deployment**

From Render Dashboard:
1. Go to service
2. Click "Manual Deploy"
3. Select branch
4. Click "Deploy"

### **Rollback**

From Render Dashboard:
1. Go to "Events" tab
2. Find previous deployment
3. Click "Rollback"

---

## 💰 Cost Optimization

### **Free Tier**

Render Free tier includes:
- ✅ 750 hours/month
- ✅ Auto-sleep after 15 min inactivity
- ✅ Wakes on request (~30s delay)
- ✅ 512MB RAM
- ✅ Shared CPU

### **Upgrade Options**

For production use:
- **Starter ($7/mo):** No sleep, 512MB RAM
- **Standard ($25/mo):** 2GB RAM, better performance
- **Pro ($85/mo):** 4GB RAM, priority support

---

## 🔐 Security

### **Environment Variables**

Never commit:
- ❌ API keys
- ❌ Secrets
- ❌ Private keys
- ❌ Database credentials

Use Render environment variables:
1. Dashboard → Service → Environment
2. Add key-value pairs
3. Redeploy

### **HTTPS**

Render provides:
- ✅ Free SSL certificate
- ✅ Automatic HTTPS
- ✅ HTTP → HTTPS redirect

---

## 📝 Deployment Checklist

Before deploying:

- [ ] All tests pass locally
- [ ] Build succeeds locally (`npm run build`)
- [ ] Production mode works locally (`NODE_ENV=production npm start`)
- [ ] Environment variables configured
- [ ] `render.yaml` is correct
- [ ] Code pushed to GitHub
- [ ] README updated
- [ ] No sensitive data in code

After deploying:

- [ ] Health check passes
- [ ] API endpoints work
- [ ] Frontend loads correctly
- [ ] URL scanner functions
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Extension can connect

---

## 🌍 Custom Domain (Optional)

### **Add Custom Domain**

1. **In Render Dashboard:**
   - Go to service settings
   - Click "Custom Domains"
   - Add your domain

2. **Update DNS:**
   - Add CNAME record:
     ```
     www.yourdomain.com → your-app.onrender.com
     ```

3. **SSL Certificate:**
   - Render auto-provisions SSL
   - Wait ~5 minutes for activation

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)
- [Environment Variables](https://render.com/docs/environment-variables)
- [Custom Domains](https://render.com/docs/custom-domains)

---

## 🆘 Support

**Issues?**
- Check Render status: https://status.render.com
- View logs in Render Dashboard
- GitHub Issues: https://github.com/manividyadhar/Malicious-URL-Detection/issues

**Need Help?**
- Render Community: https://community.render.com
- Render Support: support@render.com
