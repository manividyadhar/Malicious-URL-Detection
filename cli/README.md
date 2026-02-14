# Malicious URL Detector - CLI Tool

Command-line interface for URL analysis using the shared detection engine.

---

## Installation

```bash
cd cli
npm install
```

---

## Usage

### Direct Execution

```bash
# Using ts-node (development)
ts-node index.ts https://example.com

# Using npm script
npm run check:url https://example.com

# Using node (after build)
npm run build
node dist/index.js https://example.com
```

### Examples

**Safe URL:**
```bash
$ npm run check:url https://google.com

🔍 URL Analysis
────────────────────────────────────────────────────────────

URL: https://google.com

Verdict: ✅ SAFE

Risk Score: 0/100

Reasons:
  • No suspicious patterns detected

────────────────────────────────────────────────────────────
```

**Suspicious URL:**
```bash
$ npm run check:url http://login-verify.xyz

🔍 URL Analysis
────────────────────────────────────────────────────────────

URL: http://login-verify.xyz

Verdict: ⚠️ SUSPICIOUS

Risk Score: 48/100

Reasons:
  • URL does not use HTTPS encryption
  • Suspicious keywords detected (2)
  • URL uses suspicious top-level domain

────────────────────────────────────────────────────────────
```

**Malicious URL:**
```bash
$ npm run check:url http://192.168.1.1/urgent-login.tk

🔍 URL Analysis
────────────────────────────────────────────────────────────

URL: http://192.168.1.1/urgent-login.tk

Verdict: 🚨 MALICIOUS

Risk Score: 85/100

Reasons:
  • URL uses IP address instead of domain name
  • URL does not use HTTPS encryption
  • Suspicious keywords detected (2)
  • URL uses suspicious top-level domain

────────────────────────────────────────────────────────────
```

---

## Exit Codes

The CLI returns different exit codes based on the verdict:

- **0** - Safe URL
- **1** - Suspicious URL or error
- **2** - Malicious URL

This allows for scripting:

```bash
#!/bin/bash
npm run check:url "$1"
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "URL is safe"
elif [ $EXIT_CODE -eq 1 ]; then
  echo "URL is suspicious"
elif [ $EXIT_CODE -eq 2 ]; then
  echo "URL is malicious"
fi
```

---

## Features

✅ **Shared Detection Engine** - Uses `@malicious-url-detector/shared`  
✅ **Colored Output** - ANSI colors for better readability  
✅ **Emoji Indicators** - Visual verdict indicators  
✅ **Clean Formatting** - Easy to read terminal output  
✅ **Exit Codes** - Scriptable results  
✅ **No External Dependencies** - Only uses shared library  
✅ **Fast** - <10ms detection time  

---

## Output Format

```
🔍 URL Analysis
────────────────────────────────────────────────────────────

URL: <url>

Verdict: <emoji> <VERDICT>

Risk Score: <score>/100

Reasons:
  • <reason 1>
  • <reason 2>
  ...

────────────────────────────────────────────────────────────
```

**Verdict Colors:**
- 🟢 **Green** - Safe (0-29)
- 🟡 **Yellow** - Suspicious (30-69)
- 🔴 **Red** - Malicious (70-100)

---

## Batch Processing

You can create a script to check multiple URLs:

```bash
#!/bin/bash
# check-urls.sh

while IFS= read -r url; do
  echo "Checking: $url"
  npm run check:url "$url"
  echo ""
done < urls.txt
```

---

## Integration

### Shell Script

```bash
#!/bin/bash
URL="$1"
npm run check:url "$URL" > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Safe to visit"
else
  echo "⚠️ Potentially dangerous"
fi
```

### CI/CD Pipeline

```yaml
# .github/workflows/check-urls.yml
- name: Check URL
  run: |
    cd cli
    npm install
    npm run check:url ${{ env.URL }}
```

---

## Development

```bash
# Install dependencies
npm install

# Run directly
ts-node index.ts https://example.com

# Build
npm run build

# Run built version
node dist/index.js https://example.com
```

---

## No External Libraries

The CLI uses **zero external runtime dependencies** (except the shared library):
- ✅ No `chalk` - Uses native ANSI codes
- ✅ No `commander` - Simple argument parsing
- ✅ No `ora` - No spinners needed (instant results)
- ✅ No `inquirer` - Direct execution only

This keeps the tool:
- **Fast** - No dependency loading
- **Secure** - Minimal attack surface
- **Portable** - Easy to bundle

---

## License

MIT
