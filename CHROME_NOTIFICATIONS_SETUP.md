# Chrome Notifications Setup for Extension

## 🔔 Notification Settings

The extension uses Chrome notifications to alert users about malicious URLs. Here's how to ensure they work:

---

## ✅ Enable Notifications

### Step 1: Check Chrome Notification Settings

1. **Open Chrome Settings:**
   - Go to: `chrome://settings/content/notifications`
   - Or: Settings → Privacy and security → Site settings → Notifications

2. **Allow Notifications:**
   - Make sure **"Sites can ask to send notifications"** is enabled
   - Or set to **"Ask before sending"** (recommended)

### Step 2: Allow Extension Notifications

1. **Check Extension Permissions:**
   - Go to: `chrome://extensions/`
   - Find "Malicious URL Detector"
   - Click **"Details"**
   - Verify **"Notifications"** permission is enabled

2. **If Not Enabled:**
   - The extension should request permission on first use
   - Or manually enable in extension details

### Step 3: Test Notifications

1. **Navigate to a risky URL:**
   - Try: `http://192.168.1.1/login/verify`
   - Or: `http://account-suspended.notify.com`

2. **Expected Behavior:**
   - ✅ Browser notification appears (top-right corner)
   - ✅ Shows verdict and risk score
   - ✅ Popup overlay appears on page

---

## 🔧 Troubleshooting

### Notifications Not Showing?

**Check 1: Chrome Settings**
- Go to: `chrome://settings/content/notifications`
- Ensure notifications are not blocked
- Check if "Do not disturb" mode is enabled

**Check 2: Extension Permissions**
- Go to: `chrome://extensions/`
- Find your extension
- Click "Details"
- Verify "Notifications" permission is checked

**Check 3: Site-Specific Blocking**
- Check if notifications are blocked for specific sites
- Go to: `chrome://settings/content/notifications`
- Look for blocked sites
- Remove any blocks if needed

**Check 4: Do Not Disturb Mode**
- Check Windows/System notification settings
- Disable "Do Not Disturb" if enabled
- Check Chrome's "Quiet notification" mode

**Check 5: Extension Console**
- Open service worker console
- Look for notification errors
- Check if permission was granted

---

## 📱 Notification Types

### Browser Notifications
- **When**: Malicious or suspicious URLs (risk ≥ 60)
- **Where**: System notification area (top-right)
- **Content**: Verdict, risk score, first reason

### Popup Overlay
- **When**: Same as notifications
- **Where**: On the webpage itself
- **Content**: Full analysis details

---

## 🎯 Notification Behavior

### When Notifications Appear

1. **Malicious URLs** (any risk score)
   - ✅ Browser notification
   - ✅ Popup overlay
   - ✅ Red badge on extension

2. **Suspicious URLs** (risk score ≥ 60)
   - ✅ Browser notification
   - ✅ Popup overlay
   - ✅ Yellow badge on extension

3. **Safe URLs** (risk score < 30)
   - ❌ No notification
   - ❌ No popup
   - ✅ Green badge on extension

---

## 🔐 Permission Request

The extension requests notification permission automatically when:
- First risky URL is detected
- User interacts with extension for first time

**If permission denied:**
- Notifications won't show
- Popup overlay will still work
- Badge will still update

---

## 💡 Best Practices

1. **Keep notifications enabled** for security alerts
2. **Allow extension permissions** for full functionality
3. **Check notification settings** if alerts don't appear
4. **Test with risky URLs** to verify notifications work

---

## 🧪 Test Notifications

### Quick Test

1. **Enable notifications** (if not already)
2. **Navigate to risky URL:**
   ```
   http://192.168.1.1/login/verify
   ```
3. **Expected:**
   - Notification appears in 1-2 seconds
   - Popup overlay appears on page
   - Extension badge turns red/yellow

### Verify Settings

1. Go to: `chrome://settings/content/notifications`
2. Check:
   - ✅ "Sites can ask to send notifications" is enabled
   - ✅ Extension is not in blocked list
   - ✅ "Do not disturb" is disabled

---

## 📊 Notification Content

### What You'll See

**Notification Title:**
- `⚠️ MALICIOUS URL DETECTED`
- `⚠️ SUSPICIOUS URL DETECTED`

**Notification Message:**
- Risk Score: `XX/100`
- First reason from analysis

**Example:**
```
⚠️ MALICIOUS URL DETECTED
Risk Score: 73/100
URL contains IP address instead of domain name
```

---

## ✅ Verification Checklist

- [ ] Chrome notifications enabled in settings
- [ ] Extension has "Notifications" permission
- [ ] No site-specific blocks
- [ ] "Do not disturb" mode disabled
- [ ] Tested with risky URL
- [ ] Notification appears correctly
- [ ] Popup overlay appears correctly

---

## 🚀 Result

Once notifications are properly configured:
- ✅ Automatic alerts for risky sites
- ✅ Browser notifications
- ✅ Popup overlays
- ✅ Visual indicators (badges)

**Your extension will provide comprehensive security alerts!** 🎉
