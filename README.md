# 🛡️ Malicious URL Detection System

A comprehensive malicious URL detection system with a browser extension frontend and Python FastAPI backend. Detects suspicious and malicious URLs using heuristic analysis, feature extraction, and optional machine learning models.
# 🏗️ Malicious URL Detection System - Production Architecture Plan

**Version:** 2.0  
**Date:** February 14, 2026  
**Status:** 🟡 AWAITING APPROVAL

---

## 📋 Executive Summary

This document outlines the complete architecture for transforming the current malicious URL detection system into a production-ready platform with:

1. **CLI Tool** - Command-line interface for URL scanning
2. **Web Application** - React-based web interface hosted on Render
3. **Browser Extension** - Chrome/Firefox extension (McAfee WebAdvisor-style)
4. **Landing Page** - Marketing/documentation site with extension download
5. **Shared Detection Engine** - Unified detection logic across all platforms

---

## 🎯 Project Goals

### Primary Objectives
- ✅ **Unified Detection Logic** - Single source of truth for URL analysis
- ✅ **Multi-Platform Support** - CLI, Web, Extension all using same engine
- ✅ **Production Ready** - Proper error handling, logging, testing
- ✅ **Scalable Architecture** - Easy to extend and maintain
- ✅ **Cloud Deployment** - Render.com hosting with CI/CD

### Success Criteria
- All platforms use identical detection algorithms
- <100ms average detection time
- 99.9% API uptime on Render
- Extension works on Chrome/Firefox/Edge
- CLI tool installable via npm/pip
- Comprehensive test coverage (>80%)

---

## 📂 Proposed Folder Structure

```
M:\project\url dection\
│
├── 📦 shared/                          # Shared detection engine (TypeScript)
│   ├── src/
│   │   ├── core/
│   │   │   ├── detector.ts            # Main detection orchestrator
│   │   │   ├── features.ts            # Feature extraction
│   │   │   ├── heuristics.ts          # Heuristic scoring
│   │   │   └── types.ts               # Shared TypeScript types
│   │   ├── utils/
│   │   │   ├── url-parser.ts          # URL parsing utilities
│   │   │   ├── validators.ts          # Input validation
│   │   │   └── logger.ts              # Logging utilities
│   │   └── index.ts                   # Public API exports
│   ├── tests/
│   │   ├── detector.test.ts
│   │   ├── features.test.ts
│   │   └── heuristics.test.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── 🖥️ server/                          # Express API server
│   ├── src/
│   │   ├── routes/
│   │   │   ├── index.ts               # Route aggregator
│   │   │   ├── scan.routes.ts         # URL scanning endpoints
│   │   │   └── health.routes.ts       # Health check endpoints
│   │   ├── controllers/
│   │   │   ├── scan.controller.ts     # Scan logic controller
│   │   │   └── stats.controller.ts    # Statistics controller
│   │   ├── middleware/
│   │   │   ├── cors.middleware.ts     # CORS configuration
│   │   │   ├── rate-limit.middleware.ts # Rate limiting
│   │   │   ├── error.middleware.ts    # Error handling
│   │   │   └── logger.middleware.ts   # Request logging
│   │   ├── services/
│   │   │   ├── detector.service.ts    # Uses shared/detector
│   │   │   └── cache.service.ts       # Redis/in-memory cache
│   │   ├── config/
│   │   │   ├── env.ts                 # Environment config
│   │   │   └── constants.ts           # App constants
│   │   ├── app.ts                     # Express app setup
│   │   └── index.ts                   # Server entry point
│   ├── tests/
│   │   ├── integration/
│   │   │   └── scan.test.ts
│   │   └── unit/
│   │       └── detector.service.test.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── 🌐 client/                          # React web application
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── Scanner/
│   │   │   │   ├── URLInput.tsx
│   │   │   │   ├── ScanResult.tsx
│   │   │   │   └── RiskMeter.tsx
│   │   │   ├── Landing/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── Features.tsx
│   │   │   │   ├── HowItWorks.tsx
│   │   │   │   └── DownloadCTA.tsx
│   │   │   └── common/
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       └── Badge.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx               # Landing page
│   │   │   ├── Scanner.tsx            # URL scanner page
│   │   │   ├── About.tsx              # About page
│   │   │   └── Download.tsx           # Extension download
│   │   ├── hooks/
│   │   │   ├── useScanner.ts          # Scanner hook
│   │   │   └── useAPI.ts              # API client hook
│   │   ├── services/
│   │   │   ├── api.service.ts         # API client
│   │   │   └── analytics.service.ts   # Analytics tracking
│   │   ├── utils/
│   │   │   ├── formatters.ts          # Data formatting
│   │   │   └── constants.ts           # App constants
│   │   ├── styles/
│   │   │   ├── index.css              # Global styles
│   │   │   └── theme.ts               # Theme configuration
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tests/
│   │   └── components/
│   │       └── Scanner.test.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── README.md
│
├── 🧩 extension/                       # Browser extension
│   ├── src/
│   │   ├── background/
│   │   │   ├── service-worker.ts      # Main background script
│   │   │   ├── scanner.ts             # Uses shared/detector
│   │   │   └── storage.ts             # Chrome storage wrapper
│   │   ├── content/
│   │   │   ├── content-script.ts      # Page injection script
│   │   │   └── warning-overlay.ts     # Warning UI
│   │   ├── popup/
│   │   │   ├── popup.html
│   │   │   ├── popup.ts
│   │   │   └── popup.css
│   │   ├── shared/
│   │   │   ├── api-client.ts          # API communication
│   │   │   └── types.ts               # Extension types
│   │   └── utils/
│   │       └── helpers.ts
│   ├── public/
│   │   ├── manifest.json              # Extension manifest
│   │   ├── icons/
│   │   │   ├── icon16.png
│   │   │   ├── icon48.png
│   │   │   └── icon128.png
│   │   └── warning-popup.html
│   ├── tests/
│   │   └── scanner.test.ts
│   ├── webpack.config.js              # Build configuration
│   ├── package.json
│   └── README.md
│
├── 💻 cli/                             # Command-line tool
│   ├── src/
│   │   ├── commands/
│   │   │   ├── scan.ts                # Scan command
│   │   │   ├── batch.ts               # Batch scan from file
│   │   │   └── config.ts              # Configuration command
│   │   ├── ui/
│   │   │   ├── output.ts              # Formatted output
│   │   │   └── spinner.ts             # Loading indicators
│   │   ├── services/
│   │   │   └── detector.service.ts    # Uses shared/detector
│   │   ├── index.ts                   # CLI entry point
│   │   └── cli.ts                     # Command parser
│   ├── tests/
│   │   └── commands.test.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── 🧪 tests/                           # Integration tests
│   ├── e2e/
│   │   ├── api.e2e.test.ts
│   │   ├── web.e2e.test.ts
│   │   └── extension.e2e.test.ts
│   ├── fixtures/
│   │   ├── test-urls.json
│   │   └── mock-responses.json
│   └── setup.ts
│
├── 📚 docs/                            # Documentation
│   ├── API.md                         # API documentation
│   ├── CLI.md                         # CLI usage guide
│   ├── EXTENSION.md                   # Extension guide
│   ├── DEPLOYMENT.md                  # Deployment guide
│   └── CONTRIBUTING.md                # Contribution guide
│
├── 🔧 scripts/                         # Build & deployment scripts
│   ├── build-all.sh                   # Build all projects
│   ├── deploy-render.sh               # Deploy to Render
│   ├── package-extension.sh           # Package extension for stores
│   └── test-all.sh                    # Run all tests
│
├── 🐍 backend/                         # Legacy Python backend (deprecated)
│   └── [existing Python files]        # Keep for reference/migration
│
├── .github/
│   └── workflows/
│       ├── ci.yml                     # CI/CD pipeline
│       └── deploy.yml                 # Deployment workflow
│
├── .env.example                       # Environment template
├── .gitignore
├── package.json                       # Root workspace config
├── tsconfig.base.json                 # Base TypeScript config
├── jest.config.js                     # Jest configuration
├── render.yaml                        # Render deployment config
├── README.md                          # Main project README
└── ARCHITECTURE_PLAN.md               # This file
```

---

## 🔄 Data Flow Architecture

### 1. **Shared Detection Engine Flow**

```
┌─────────────────────────────────────────────────────────────┐
│                    SHARED DETECTION ENGINE                  │
│                      (TypeScript Module)                     │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Features   │───▶│  Heuristics  │───▶│   Detector   │  │
│  │  Extraction  │    │   Scoring    │    │ Orchestrator │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │         │
│         └────────────────────┴────────────────────┘         │
│                              │                              │
└──────────────────────────────┼──────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
         ┌──────────┐   ┌──────────┐   ┌──────────┐
         │   CLI    │   │  Server  │   │Extension │
         │   Tool   │   │   API    │   │ (Local)  │
         └──────────┘   └──────────┘   └──────────┘
                               │
                               ▼
                        ┌──────────┐
                        │   Web    │
                        │  Client  │
                        └──────────┘
```

### 2. **API Request Flow**

```
Client/Extension/CLI
       │
       │ HTTP POST /api/scan
       ▼
┌─────────────────┐
│  Rate Limiter   │ ──▶ 429 Too Many Requests
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validator      │ ──▶ 400 Bad Request
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cache Check    │ ──▶ Return cached result
└────────┬────────┘
         │ Cache miss
         ▼
┌─────────────────┐
│ Detector Service│
│ (uses shared/)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cache Store    │
└────────┬────────┘
         │
         ▼
    200 OK + Result
```

### 3. **Extension Architecture**

```
┌──────────────────────────────────────────────────────┐
│                  Browser Tab                         │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │         Content Script                     │    │
│  │  - Monitor page links                      │    │
│  │  - Inject warning overlays                 │    │
│  │  - Send URLs to background                 │    │
│  └───────────────┬────────────────────────────┘    │
└──────────────────┼───────────────────────────────────┘
                   │ chrome.runtime.sendMessage
                   ▼
┌──────────────────────────────────────────────────────┐
│            Background Service Worker                 │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  Scanner Service (uses shared/detector)    │    │
│  │  - Local detection (instant)               │    │
│  │  - API fallback (optional ML)              │    │
│  │  - Cache management                        │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  Storage Manager                           │    │
│  │  - Scan results cache                      │    │
│  │  - User preferences                        │    │
│  └────────────────────────────────────────────┘    │
└──────────────────┬───────────────────────────────────┘
                   │
                   │ Optional: API call for ML
                   ▼
            ┌─────────────┐
            │  Server API │
            └─────────────┘
```

---

## 🔌 API Endpoints

### Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://malicious-url-detection.onrender.com/api`

### Endpoints

#### 1. **POST /api/scan**
Scan a single URL

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "risk_score": 15,
  "verdict": "safe",
  "reasons": ["No suspicious patterns detected"],
  "features": {
    "url_length": 23,
    "has_https": true,
    "has_ip": false,
    "suspicious_keyword_count": 0
  },
  "processing_time_ms": 12.5,
  "cached": false
}
```

#### 2. **POST /api/scan/batch**
Scan multiple URLs

**Request:**
```json
{
  "urls": [
    "https://example.com",
    "http://suspicious-site.com"
  ]
}
```

**Response:**
```json
{
  "results": [
    { "url": "...", "risk_score": 15, ... },
    { "url": "...", "risk_score": 75, ... }
  ],
  "total": 2,
  "processing_time_ms": 45.2
}
```

#### 3. **GET /api/health**
Health check

**Response:**
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "uptime": 3600,
  "timestamp": "2026-02-14T19:53:10Z"
}
```

#### 4. **GET /api/stats**
System statistics (optional)

**Response:**
```json
{
  "total_scans": 1234,
  "cache_hit_rate": 0.65,
  "avg_processing_time_ms": 15.3
}
```

---

## 🖥️ CLI Command Structure

### Installation
```bash
# Via npm (recommended)
npm install -g @malicious-url-detector/cli

# Via npx (no install)
npx @malicious-url-detector/cli scan https://example.com
```

### Commands

#### 1. **scan** - Scan a single URL
```bash
# Basic scan
url-detector scan https://example.com

# With JSON output
url-detector scan https://example.com --json

# Verbose mode
url-detector scan https://example.com --verbose
```

**Output:**
```
🔍 Scanning: https://example.com

✅ SAFE (Risk Score: 15/100)

Reasons:
  • No suspicious patterns detected

Features:
  • URL Length: 23 characters
  • HTTPS: Yes
  • IP Address: No
  • Suspicious Keywords: 0

Processing Time: 12.5ms
```

#### 2. **batch** - Scan multiple URLs from file
```bash
# Scan from file
url-detector batch urls.txt

# With output file
url-detector batch urls.txt --output results.json

# CSV output
url-detector batch urls.txt --format csv --output results.csv
```

#### 3. **config** - Configuration management
```bash
# Set API endpoint
url-detector config set api-url https://api.example.com

# View configuration
url-detector config list

# Reset to defaults
url-detector config reset
```

#### 4. **version** - Show version
```bash
url-detector --version
# Output: 2.0.0
```

---

## 🧩 Extension Background Script Logic

### Core Responsibilities

1. **Automatic URL Scanning**
   - Monitor tab navigation
   - Scan URLs on page load
   - Cache results per tab

2. **Local Detection First**
   - Use bundled `shared/detector` for instant results
   - No network latency
   - Works offline

3. **Optional API Enhancement**
   - Fallback to API for ML predictions
   - Only if user opts in
   - Graceful degradation

4. **Warning System**
   - Show badge on extension icon
   - Browser notifications for high-risk sites
   - Inject warning overlay via content script

### Implementation Flow

```typescript
// Background Service Worker (Manifest V3)

import { URLDetector } from '@shared/detector';

const detector = new URLDetector();
const scanCache = new Map();

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    await scanTab(tabId, tab.url);
  }
});

async function scanTab(tabId: number, url: string) {
  // Skip internal URLs
  if (url.startsWith('chrome://')) return;
  
  // Check cache
  if (scanCache.has(url)) {
    const result = scanCache.get(url);
    updateBadge(tabId, result);
    return;
  }
  
  // Local detection (instant)
  const result = detector.scan(url);
  
  // Cache result
  scanCache.set(url, result);
  
  // Update UI
  updateBadge(tabId, result);
  
  // Show warning if needed
  if (result.verdict === 'malicious') {
    showWarning(tabId, result);
  }
  
  // Optional: Enhance with API (background)
  enhanceWithAPI(url, result);
}
```

---

## 🚀 Deployment Plan for Render

### 1. **Server Deployment**

**Service Type:** Web Service

**Build Configuration:**
```yaml
# render.yaml
services:
  - type: web
    name: malicious-url-detection-api
    env: node
    region: oregon
    plan: starter
    buildCommand: |
      npm install
      npm run build:shared
      npm run build:server
    startCommand: npm run start:server
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        sync: false
      - key: RATE_LIMIT_MAX
        value: 100
      - key: CACHE_TTL
        value: 300
    healthCheckPath: /api/health
```

**Environment Variables:**
- `NODE_ENV=production`
- `PORT` (auto-assigned by Render)
- `RATE_LIMIT_MAX=100` (requests per 15 min)
- `CACHE_TTL=300` (5 minutes)
- `CORS_ORIGINS=https://malicious-url-detection.onrender.com,chrome-extension://*`

### 2. **Client Deployment**

**Service Type:** Static Site

**Build Configuration:**
```yaml
  - type: web
    name: malicious-url-detection-web
    env: static
    buildCommand: |
      npm install
      npm run build:shared
      npm run build:client
    staticPublishPath: ./client/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    envVars:
      - key: VITE_API_URL
        value: https://malicious-url-detection-api.onrender.com
```

### 3. **CI/CD Pipeline**

**GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:all
      - run: npm run build:all
      # Render auto-deploys on push to main
```

---

## 📦 Extension Build Plan

### Build Process

1. **Development Build**
```bash
cd extension
npm run build:dev
# Output: extension/dist/ (unminified, with source maps)
```

2. **Production Build**
```bash
cd extension
npm run build:prod
# Output: extension/dist/ (minified, optimized)
```

3. **Package for Distribution**
```bash
npm run package
# Output: extension/releases/malicious-url-detector-v2.0.0.zip
```

### Webpack Configuration

```javascript
// extension/webpack.config.js
module.exports = {
  entry: {
    'background': './src/background/service-worker.ts',
    'content': './src/content/content-script.ts',
    'popup': './src/popup/popup.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
```

### Store Submission

**Chrome Web Store:**
1. Build production version
2. Create promotional images (1280x800, 640x400, 440x280)
3. Write store description
4. Submit for review
5. Publish

**Firefox Add-ons:**
1. Same build process
2. Sign with Mozilla
3. Submit to AMO (addons.mozilla.org)

**Edge Add-ons:**
1. Use same Chrome build
2. Submit to Microsoft Edge Add-ons store

---

## 🧪 Testing Strategy

### 1. **Unit Tests**
- All modules in `shared/`
- Individual services
- Utility functions

### 2. **Integration Tests**
- API endpoints
- CLI commands
- Extension message passing

### 3. **E2E Tests**
- Full user flows
- Browser automation (Playwright)
- API contract tests

### 4. **Test Coverage Goals**
- Shared library: >90%
- Server: >80%
- Client: >70%
- Extension: >75%
- CLI: >85%

---

## 🔒 Security Considerations

1. **Input Validation**
   - Sanitize all URLs
   - Prevent injection attacks
   - Rate limiting

2. **API Security**
   - CORS properly configured
   - Rate limiting per IP
   - Request size limits

3. **Extension Security**
   - Content Security Policy
   - Minimal permissions
   - No eval() or inline scripts

4. **Data Privacy**
   - No URL logging in production
   - Anonymous analytics only
   - GDPR compliance

---

## 📊 Migration Strategy

### Phase 1: Setup (Week 1)
- ✅ Create folder structure
- ✅ Setup TypeScript configs
- ✅ Initialize npm workspaces
- ✅ Setup testing framework

### Phase 2: Shared Library (Week 1-2)
- ✅ Port Python detection logic to TypeScript
- ✅ Create unified detector API
- ✅ Write comprehensive tests
- ✅ Document API

### Phase 3: Server (Week 2)
- ✅ Build Express API
- ✅ Integrate shared library
- ✅ Add caching layer
- ✅ Setup Render deployment

### Phase 4: Client (Week 2-3)
- ✅ Build React landing page
- ✅ Create scanner interface
- ✅ Integrate with API
- ✅ Deploy to Render

### Phase 5: Extension (Week 3)
- ✅ Refactor to use shared library
- ✅ Implement local-first detection
- ✅ Add API fallback
- ✅ Package for stores

### Phase 6: CLI (Week 3-4)
- ✅ Build CLI tool
- ✅ Integrate shared library
- ✅ Add batch processing
- ✅ Publish to npm

### Phase 7: Testing & Polish (Week 4)
- ✅ E2E testing
- ✅ Performance optimization
- ✅ Documentation
- ✅ Launch! 🚀

---

## 🎨 Detection Strategy

### Core Algorithm (Shared Library)

```typescript
interface ScanResult {
  url: string;
  risk_score: number;        // 0-100
  verdict: 'safe' | 'suspicious' | 'malicious';
  reasons: string[];
  features: URLFeatures;
  processing_time_ms: number;
}

class URLDetector {
  scan(url: string): ScanResult {
    // 1. Extract features
    const features = this.extractFeatures(url);
    
    // 2. Calculate heuristic score
    const { score, reasons } = this.calculateHeuristics(features);
    
    // 3. Determine verdict
    const verdict = this.getVerdict(score);
    
    return {
      url,
      risk_score: score,
      verdict,
      reasons,
      features,
      processing_time_ms: performance.now() - start,
    };
  }
}
```

### Feature Extraction
- URL length
- Character patterns (dots, hyphens, special chars)
- IP address detection
- Suspicious keywords
- HTTPS check
- Subdomain count
- URL shortening services

### Heuristic Scoring
- Each feature contributes to risk score
- Weighted scoring based on severity
- Thresholds: 0-29 (safe), 30-69 (suspicious), 70-100 (malicious)

### Future Enhancements
- ML model integration (optional)
- Reputation database
- Real-time threat feeds
- User feedback loop

---

## 📈 Success Metrics

### Technical Metrics
- API response time: <100ms (p95)
- Extension detection time: <10ms (local)
- Test coverage: >80%
- Uptime: 99.9%

### User Metrics
- Extension installs: Track growth
- API requests: Monitor usage
- False positive rate: <5%
- User satisfaction: >4.5/5

---

## ❓ Open Questions

1. **ML Model:** Should we include optional ML model in Phase 1?
2. **Database:** Do we need persistent storage for scan history?
3. **Analytics:** What analytics platform to use?
4. **Monetization:** Free tier limits? Premium features?

---

## ✅ Next Steps

**After approval of this plan:**

1. Create npm workspace structure
2. Setup TypeScript configurations
3. Port Python detector to TypeScript (shared library)
4. Build Express API server
5. Create React landing page
6. Refactor extension to use shared library
7. Build CLI tool
8. Setup CI/CD pipeline
9. Deploy to Render
10. Submit extension to stores

---

## 📞 Approval Required

**This is an architecture plan only. No files have been modified.**

Please review and approve before proceeding with implementation.

**Approval Checklist:**
- [ ] Folder structure approved
- [ ] API endpoints approved
- [ ] CLI commands approved
- [ ] Extension architecture approved
- [ ] Deployment strategy approved
- [ ] Migration timeline approved

**Questions or changes needed?** Please provide feedback!

---

**Document Version:** 2.0  
**Last Updated:** February 14, 2026  
**Author:** AI Assistant  
**Status:** 🟡 Awaiting Approval



This tool is for educational and security research purposes. Always verify URL safety through multiple sources and use at your own risk.
