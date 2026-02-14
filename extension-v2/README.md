# Malicious URL Detector - Browser Extension

Manifest V3 browser extension for real-time URL safety checking.

---

## Features

✅ **Popup Interface** - Click extension icon to check current page  
✅ **Color Badge** - Visual indicator on extension icon  
  - 🟢 Green (✓) - Safe  
  - 🟡 Yellow (!) - Suspicious  
  - 🔴 Red (✗) - Malicious  
✅ **API Integration** - Calls production API for analysis  
✅ **Minimal Permissions** - Only `activeTab` and `scripting`  
✅ **Clean UI** - Professional popup design  
✅ **TypeScript** - Type-safe code  

---

## Installation

### **Development**

1. **Install dependencies:**
   ```bash
   cd extension-v2
   npm install
   ```

2. **Build the extension:**
   ```bash
   npm run build
   ```

3. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension-v2/dist` folder

4. **Load in Firefox:**
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select `extension-v2/dist/manifest.json`

5. **Load in Edge:**
   - Open `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension-v2/dist` folder

---

## Usage

1. **Click the extension icon** (🛡️) in your browser toolbar
2. **View the current page URL** in the popup
3. **Click "Check URL Safety"** button
4. **View the result:**
   - ✅ **Safe** - Green background, low risk score
   - ⚠️ **Suspicious** - Yellow background, medium risk score
   - 🚨 **Malicious** - Red background, high risk score
5. **Check the badge** on the extension icon for quick status

---

## Build Instructions

### **Build for Production**

```bash
# Install dependencies
npm install

# Build TypeScript and copy files
npm run build
```

Output: `dist/` folder ready for distribution

### **Development Mode**

```bash
# Watch for TypeScript changes
npm run watch
```

### **Clean Build**

```bash
# Remove dist folder
npm run clean

# Rebuild
npm run build
```

---

## Project Structure

```
extension-v2/
├── src/
│   ├── background.ts        # Service worker (badge management)
│   ├── popup.ts             # Popup UI logic
│   ├── popup.html           # Popup interface
│   ├── contentScript.ts     # Content script (minimal)
│   ├── manifest.json        # Extension manifest
│   └── icons/               # Extension icons
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
├── scripts/
│   └── copy-files.js        # Build script
├── dist/                    # Build output (git-ignored)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Manifest V3 Details

### **Permissions**

```json
{
  "permissions": [
    "activeTab",    // Access current tab URL
    "scripting"     // Execute scripts if needed
  ]
}
```

**Why minimal permissions?**
- ✅ No `tabs` permission (only `activeTab`)
- ✅ No `storage` permission (stateless)
- ✅ No `webRequest` permission (API-based)
- ✅ Privacy-focused

### **Service Worker**

Background script runs as a service worker:
- Handles API communication
- Updates badge colors
- Manages extension state

### **Popup**

Popup opens when clicking extension icon:
- Shows current tab URL
- "Check URL" button
- Displays analysis results
- Color-coded verdict

---

## API Integration

The extension calls:
```
POST https://malicious-url-detection-cmxm.onrender.com/api/check-url
```

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
  "processingTimeMs": 5
}
```

---

## Badge Colors

The extension updates the badge based on verdict:

| Verdict | Color | Badge Text |
|---------|-------|------------|
| Safe | 🟢 Green (#10b981) | ✓ |
| Suspicious | 🟡 Yellow (#f59e0b) | ! |
| Malicious | 🔴 Red (#ef4444) | ✗ |

Badge is cleared when navigating to a new page.

---

## Distribution

### **Chrome Web Store**

1. Build the extension: `npm run build`
2. Zip the `dist/` folder
3. Upload to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
4. Fill in store listing details
5. Submit for review

### **Firefox Add-ons**

1. Build the extension: `npm run build`
2. Zip the `dist/` folder
3. Upload to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
4. Fill in listing details
5. Submit for review

### **Edge Add-ons**

1. Build the extension: `npm run build`
2. Zip the `dist/` folder
3. Upload to [Microsoft Edge Add-ons](https://partner.microsoft.com/dashboard/microsoftedge/overview)
4. Fill in listing details
5. Submit for review

---

## Creating Icons

You need three icon sizes:
- `icon16.png` - 16x16px (toolbar)
- `icon48.png` - 48x48px (extension management)
- `icon128.png` - 128x128px (Chrome Web Store)

**Recommended:**
- Use a shield (🛡️) or lock (🔒) symbol
- Primary color: #667eea (purple)
- Simple, recognizable design
- Transparent background

Place icons in `src/icons/` folder.

---

## Security & Privacy

### **No Data Collection**
- URLs are sent to API for analysis only
- No logging or storage
- No tracking or analytics

### **HTTPS Only**
- API endpoint uses HTTPS
- Secure communication

### **Minimal Permissions**
- Only accesses current tab when clicked
- No background tab monitoring
- No browsing history access

---

## Development Tips

### **Testing**

1. Load extension in developer mode
2. Open browser DevTools
3. Check "Service Worker" logs for background script
4. Check popup console for popup script
5. Test on various URLs:
   - Safe: `https://google.com`
   - Suspicious: `http://login-verify.xyz`
   - Malicious: `http://192.168.1.1/login`

### **Debugging**

- **Background script:** `chrome://extensions/` → "Service Worker" → Inspect
- **Popup:** Right-click popup → "Inspect"
- **Content script:** Browser DevTools → Console

### **Hot Reload**

After making changes:
1. Run `npm run build`
2. Go to `chrome://extensions/`
3. Click reload icon on extension card

---

## Troubleshooting

### **Extension not loading**
- Check `dist/` folder exists
- Verify `manifest.json` is valid
- Check browser console for errors

### **API calls failing**
- Verify API URL is correct
- Check network tab in DevTools
- Ensure API is running

### **Badge not updating**
- Check service worker logs
- Verify tab ID is correct
- Reload extension

---

## License

MIT

---

## Important Notes

⚠️ **Do not commit:**
- API keys (none used currently)
- Private keys
- Store credentials
- User data

✅ **Safe to commit:**
- Source code
- Build scripts
- Documentation
- Icons (if original)

---

## Future Enhancements

Potential features:
- [ ] Automatic URL checking on page load
- [ ] Whitelist/blacklist management
- [ ] Notification system
- [ ] Statistics dashboard
- [ ] Export scan history
- [ ] Custom API endpoint configuration

---

## Support

For issues or questions:
- GitHub: [Malicious-URL-Detection](https://github.com/manividyadhar/Malicious-URL-Detection)
- API: https://malicious-url-detection-cmxm.onrender.com
