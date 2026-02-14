# Malicious URL Detector - Web Client

React web application for URL safety checking.

---

## Features

✅ **Landing Page** - Project info, features, how it works  
✅ **URL Scanner** - Real-time URL checking with color-coded results  
✅ **About Page** - Detailed information about the project  
✅ **Clean UI** - Minimal design, no heavy libraries  
✅ **Responsive** - Works on desktop and mobile  
✅ **Fast** - Optimized with Vite  

---

## Installation

```bash
cd client
npm install
```

---

## Development

```bash
# Start development server
npm run dev
```

Server runs on `http://localhost:3000`

The dev server proxies `/api` requests to `http://localhost:5000` (or `VITE_API_URL`)

---

## Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Environment Variables

Create `.env` file:

```bash
# API URL (optional in development, uses proxy)
VITE_API_URL=https://your-api-url.com
```

---

## Pages

### **Home (`/`)**
- Hero section with project name and description
- URL scanner with input field
- How it works (3 steps)
- Features grid (6 features)
- Download extension section

### **About (`/about`)**
- What is this?
- How does it work?
- Risk scoring explanation
- Available tools
- Privacy & security
- Open source info

---

## Components

### **Layout**
- Header with logo and navigation
- Footer with copyright
- Wraps all pages

### **URLScanner**
- URL input field
- "Check URL" button
- Loading state
- Error handling
- Color-coded results:
  - 🟢 Green - Safe (0-29)
  - 🟡 Yellow - Suspicious (30-69)
  - 🔴 Red - Malicious (70-100)

---

## Styling

- **No UI libraries** - Pure CSS
- **CSS Variables** - Easy theming
- **Responsive** - Mobile-first design
- **Clean & Minimal** - Professional look

---

## API Integration

The scanner calls `POST /api/check-url`:

```typescript
const response = await fetch(`${apiUrl}/api/check-url`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ url }),
});
```

---

## Deployment (Render)

The client is configured to deploy as a static site on Render.

**Build Command:**
```bash
cd client && npm install && npm run build
```

**Publish Directory:**
```
client/dist
```

**Environment Variables:**
- `VITE_API_URL` - Production API URL

---

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Layout.tsx        # Header, footer, navigation
│   │   └── URLScanner.tsx    # URL input and results
│   ├── pages/
│   │   ├── Home.tsx          # Landing page
│   │   └── About.tsx         # About page
│   ├── styles/
│   │   └── index.css         # Global styles
│   ├── App.tsx               # Main app with routing
│   ├── main.tsx              # Entry point
│   └── vite-env.d.ts         # TypeScript types
├── index.html                # HTML template
├── vite.config.ts            # Vite configuration
├── package.json
└── tsconfig.json
```

---

## Color Scheme

```css
--color-primary: #667eea      /* Primary brand color */
--color-safe: #10b981         /* Green for safe */
--color-suspicious: #f59e0b   /* Yellow for suspicious */
--color-malicious: #ef4444    /* Red for malicious */
```

---

## License

MIT
