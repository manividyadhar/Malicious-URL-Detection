# Malicious URL Detector - API Server

Express API server using the shared detection engine.

---

## Features

✅ **Shared Detection Engine** - Uses `@malicious-url-detector/shared`  
✅ **RESTful API** - Clean endpoint design  
✅ **Input Validation** - Comprehensive request validation  
✅ **CORS Configured** - Ready for browser extension and web client  
✅ **Rate Limiting** - 100 requests per 15 minutes  
✅ **Security Headers** - Helmet.js integration  
✅ **Error Handling** - Centralized error management  
✅ **Render Ready** - Configured for Render.com deployment  

---

## Installation

```bash
# Install dependencies
cd server
npm install

# Build shared library first
cd ../shared
npm install
npm run build

# Build server
cd ../server
npm run build
```

---

## Development

```bash
# Start development server (with auto-reload)
npm run dev:watch

# Or without auto-reload
npm run dev
```

Server will start on `http://localhost:5000`

---

## Production

```bash
# Build
npm run build

# Start
npm start
```

---

## API Endpoints

### **POST /api/check-url**

Check if a URL is malicious.

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
  "isValid": true,
  "riskScore": 0,
  "verdict": "safe",
  "reasons": ["No suspicious patterns detected"],
  "features": {
    "urlLength": 23,
    "domainLength": 11,
    "hasIP": false,
    "hasHTTPS": true,
    "dotCount": 1,
    "hyphenCount": 0,
    "specialCharCount": 0,
    "subdomainCount": 0,
    "suspiciousKeywordCount": 0,
    "hasSuspiciousTLD": false,
    "hasShortener": false,
    "domainEntropy": 3.12,
    "pathLength": 1,
    "queryParamCount": 0
  },
  "processingTimeMs": 5,
  "timestamp": "2026-02-14T14:32:40.123Z"
}
```

**Error Response:**
```json
{
  "error": {
    "message": "URL is required",
    "field": "url"
  }
}
```

### **GET /api/health**

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "malicious-url-detector-api",
  "version": "1.0.0",
  "timestamp": "2026-02-14T14:32:40.123Z",
  "uptime": 3600.5
}
```

### **GET /**

API information.

**Response:**
```json
{
  "service": "Malicious URL Detector API",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /api/health",
    "checkUrl": "POST /api/check-url"
  },
  "documentation": "https://github.com/manividyadhar/Malicious-URL-Detection"
}
```

---

## Environment Variables

Create `.env` file (see `.env.example`):

```bash
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Response:** 429 Too Many Requests

---

## CORS Configuration

Configured to allow:
- ✅ `localhost` origins (development)
- ✅ `chrome-extension://` origins (browser extension)
- ✅ `moz-extension://` origins (Firefox extension)
- ✅ Configured production URLs

---

## Deployment (Render)

The server is configured for Render.com deployment via `render.yaml`.

**Build Command:**
```bash
npm install
cd shared && npm install && npm run build
cd ../server && npm install && npm run build
```

**Start Command:**
```bash
cd server && npm start
```

**Environment Variables (Render):**
- `NODE_ENV=production`
- `PORT` (auto-assigned by Render)

**Health Check:** `/api/health`

---

## Testing

```bash
# Run tests
npm test

# With coverage
npm run test:coverage
```

---

## Project Structure

```
server/
├── src/
│   ├── controllers/
│   │   └── scan.controller.ts    # Request handlers
│   ├── middleware/
│   │   ├── cors.middleware.ts    # CORS configuration
│   │   ├── error.middleware.ts   # Error handling
│   │   └── validation.middleware.ts # Input validation
│   ├── routes/
│   │   └── index.ts              # API routes
│   ├── app.ts                    # Express app setup
│   └── index.ts                  # Server entry point
├── dist/                         # Build output
├── package.json
├── tsconfig.json
└── README.md
```

---

## Example Usage

### cURL

```bash
# Check URL
curl -X POST http://localhost:5000/api/check-url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Health check
curl http://localhost:5000/api/health
```

### JavaScript (Fetch)

```javascript
const response = await fetch('http://localhost:5000/api/check-url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com'
  })
});

const result = await response.json();
console.log(result.verdict); // 'safe'
```

### Browser Extension

```javascript
chrome.runtime.sendMessage({
  action: 'checkURL',
  url: 'https://example.com'
}, (response) => {
  console.log(response.verdict);
});
```

---

## Security Features

1. **Helmet.js** - Security headers
2. **Rate Limiting** - Prevent abuse
3. **Input Validation** - Sanitize requests
4. **CORS** - Controlled access
5. **Error Handling** - No sensitive data leaks

---

## License

MIT
