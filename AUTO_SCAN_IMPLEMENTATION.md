# Automatic URL Scanning Implementation

## 🎯 Overview

The extension now automatically scans URLs in real-time without user interaction. When a user opens or switches to a website, the extension:

1. ✅ Automatically detects the active tab URL
2. ✅ Sends URL to Python backend for analysis
3. ✅ Receives risk score and verdict
4. ✅ Shows popup warnings for suspicious/malicious sites
5. ✅ Updates extension badge with risk indicator
6. ✅ Caches results to avoid repeated scans

---

## 🔄 Flow Diagram

```
User Opens/Switches Tab
         ↓
chrome.tabs.onUpdated / chrome.tabs.onActivated
         ↓
autoScanTab() function
         ↓
Check cache → If cached & fresh → Use cache
         ↓
If not cached → scanURL() → POST to http://127.0.0.1:8000/scan-url
         ↓
Backend returns: { risk_score, verdict, reasons }
         ↓
Store result in chrome.storage.local
         ↓
Update extension badge (Green/Yellow/Red)
         ↓
If suspicious/malicious → Show browser notification
         ↓
When popup opens → Load cached result → Display in UI
```

---

## 📝 Implementation Details

### 1. Automatic Tab Monitoring

**File**: `extension/background.js`

#### `chrome.tabs.onUpdated` Listener
- Triggers when a tab's URL changes or page finishes loading
- Only scans when `changeInfo.status === 'complete'`
- Skips internal browser pages (chrome://, about:, etc.)

#### `chrome.tabs.onActivated` Listener
- Triggers when user switches to a different tab
- Checks for cached scan result
- If no cache or cache is older than 1 minute, triggers new scan

### 2. Auto-Scan Function

```javascript
async function autoScanTab(tabId, url)
```

**Features:**
- Prevents duplicate scans (tracks `scanningTabs` Set)
- Skips non-HTTP/HTTPS URLs
- Caches results in `chrome.storage.local`
- Updates extension badge
- Shows notifications for risky sites

### 3. Badge Updates

**Colors:**
- 🟢 Green (`#28a745`) - Safe (risk < 30)
- 🟡 Yellow (`#ffc107`) - Suspicious (risk 30-69)
- 🔴 Red (`#dc3545`) - Malicious (risk ≥ 70)

**Badge Text:**
- `✓` - Safe
- `!` - Suspicious
- `⚠` - Malicious

### 4. Notifications

**Shown for:**
- Malicious URLs (any risk score)
- Suspicious URLs (risk score ≥ 60)

**Notification includes:**
- Verdict (MALICIOUS/SUSPICIOUS)
- Risk score
- First reason from analysis

### 5. Popup Auto-Load

**File**: `extension/popup.js`

When popup opens:
1. Automatically loads current tab's scan result
2. Displays risk score, verdict, and reasons
3. Shows cached result if available
4. Triggers new scan if no cache exists

---

## 🔧 Configuration

### API URL Priority

Changed to use `127.0.0.1` as primary (more reliable for extensions):

```javascript
const API_BASE_URLS = [
  'http://127.0.0.1:8000',  // Primary
  'http://localhost:8000'   // Fallback
];
```

### Cache Duration

- Scan results cached for **5 minutes**
- Tab-specific results stored with key: `scan_result_${tabId}`
- Popup checks cache before making new request

### Scan Triggers

Automatic scanning happens when:
1. ✅ New tab is opened and page loads
2. ✅ User navigates to a new URL in existing tab
3. ✅ User switches to a different tab (if no recent cache)
4. ✅ User opens extension popup (if no cache)

---

## 📊 Data Flow

### Storage Structure

```javascript
{
  `scan_result_${tabId}`: {
    url: "https://example.com",
    risk_score: 45,
    verdict: "suspicious",
    reasons: ["Suspicious keywords detected", "Multiple subdomains"],
    timestamp: 1234567890
  }
}
```

### API Request

```javascript
POST http://127.0.0.1:8000/scan-url
Content-Type: application/json

{
  "url": "https://example.com"
}
```

### API Response

```javascript
{
  "url": "https://example.com",
  "risk_score": 45,
  "verdict": "suspicious",
  "reasons": ["Suspicious keywords detected", "Multiple subdomains"],
  "ml_confidence": null,
  "processing_time_ms": 12.34
}
```

---

## 🎨 UI Features

### Popup Display

**Auto-loads on open:**
- Shows current tab's scan result immediately
- Displays risk score with color coding
- Lists all analysis reasons
- Shows processing time

**Color Coding:**
- Green background - Safe
- Yellow background - Suspicious
- Red background - Malicious

### Badge Indicator

Extension icon shows:
- Green badge with `✓` - Safe site
- Yellow badge with `!` - Suspicious site
- Red badge with `⚠` - Malicious site

---

## 🔐 Permissions

### Required Permissions

```json
{
  "permissions": [
    "tabs",           // Access tab information
    "activeTab",      // Access active tab
    "storage",        // Store scan results
    "notifications"   // Show warnings
  ],
  "host_permissions": [
    "http://127.0.0.1:8000/*",  // Backend API
    "http://localhost:8000/*",  // Backend fallback
    "https://*/*",              // Scan HTTPS sites
    "http://*/*"                // Scan HTTP sites
  ]
}
```

---

## 🧪 Testing

### Test Scenarios

1. **Open new tab with safe URL**
   - Navigate to `https://www.google.com`
   - Extension should scan automatically
   - Badge should show green `✓`
   - No notification should appear

2. **Open suspicious URL**
   - Navigate to `http://192.168.1.1/login`
   - Extension should scan automatically
   - Badge should show yellow `!` or red `⚠`
   - Notification should appear

3. **Switch between tabs**
   - Open multiple tabs
   - Switch between them
   - Extension should use cache if recent
   - Badge should update for each tab

4. **Open popup**
   - Click extension icon
   - Popup should show current tab's scan result
   - Should load immediately (from cache)

---

## 🐛 Error Handling

### Silent Failures

- Backend unavailable: Logs error but doesn't interrupt user
- Invalid URLs: Skips internal browser pages
- Network errors: Retries with fallback URL (localhost)

### User-Facing Errors

- Popup shows error if backend is unavailable
- Clear error messages with troubleshooting steps

---

## ⚡ Performance

### Optimizations

1. **Caching**: Results cached for 5 minutes
2. **Deduplication**: Prevents duplicate scans for same tab
3. **Lazy Loading**: Only scans when needed
4. **Background Processing**: Scans don't block UI

### Resource Usage

- Minimal CPU: Only scans on tab changes
- Minimal Network: Uses cache when possible
- Minimal Storage: Only stores recent results

---

## 🚀 Usage

### For Users

1. **Install extension**
2. **Start backend**: `cd backend && python main.py`
3. **Browse normally** - Extension works automatically
4. **Check badge** - See risk level at a glance
5. **Open popup** - View detailed analysis

### No User Interaction Required!

The extension works completely automatically:
- ✅ Scans URLs as you browse
- ✅ Shows warnings for risky sites
- ✅ Updates badge in real-time
- ✅ Caches results for performance

---

## 📚 Code Structure

### Key Functions

1. `autoScanTab(tabId, url)` - Main auto-scan function
2. `updateBadge(tabId, verdict, riskScore)` - Updates extension badge
3. `scanURL(url)` - Sends request to backend
4. `loadCurrentTabResult()` - Loads result in popup

### Event Listeners

1. `chrome.tabs.onUpdated` - Tab URL changes
2. `chrome.tabs.onActivated` - Tab switching
3. `chrome.runtime.onMessage` - Popup requests

---

## ✅ Verification Checklist

- [ ] Extension automatically scans on tab open
- [ ] Extension scans on tab switch
- [ ] Badge updates with correct color
- [ ] Notifications show for risky sites
- [ ] Popup displays cached results
- [ ] Cache prevents duplicate scans
- [ ] Backend uses 127.0.0.1 as primary
- [ ] No "Failed to fetch" errors
- [ ] Works with safe, suspicious, and malicious URLs

---

## 🎯 Result

The extension now provides **real-time, automatic URL scanning** with:
- ✅ Zero user interaction required
- ✅ Instant risk assessment
- ✅ Visual indicators (badge colors)
- ✅ Popup warnings
- ✅ Browser notifications
- ✅ Efficient caching

**The extension works seamlessly in the background!** 🎉
