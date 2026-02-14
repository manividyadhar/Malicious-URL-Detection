# Shared Detection Engine

**Deterministic URL analysis engine for malicious content detection.**

Used across CLI, Browser Extension, and Server platforms.

---

## Features

✅ **URL Validation** - Comprehensive URL format and structure validation  
✅ **Phishing Detection** - 50+ phishing keyword patterns  
✅ **Suspicious TLD Detection** - Identifies high-risk top-level domains  
✅ **IP Address Detection** - Flags URLs using IPs instead of domains  
✅ **Entropy Analysis** - Detects randomly generated domains  
✅ **Heuristic Scoring** - Risk score from 0-100  
✅ **No External APIs** - Fully deterministic and offline-capable  
✅ **TypeScript** - Full type safety  

---

## Installation

```bash
npm install @malicious-url-detector/shared
```

---

## Usage

### Basic Analysis

```typescript
import { analyzeURL } from '@malicious-url-detector/shared';

const result = analyzeURL('https://example.com');

console.log(result);
// {
//   isValid: true,
//   riskScore: 0,
//   verdict: 'safe',
//   reasons: ['No suspicious patterns detected']
// }
```

### With Detailed Features

```typescript
const result = analyzeURL('http://suspicious-site.tk', true);

console.log(result);
// {
//   isValid: true,
//   riskScore: 65,
//   verdict: 'suspicious',
//   reasons: [
//     'URL does not use HTTPS encryption',
//     'URL uses suspicious top-level domain'
//   ],
//   features: {
//     urlLength: 28,
//     domainLength: 18,
//     hasIP: false,
//     hasHTTPS: false,
//     dotCount: 1,
//     hyphenCount: 1,
//     specialCharCount: 0,
//     subdomainCount: 0,
//     suspiciousKeywordCount: 0,
//     hasSuspiciousTLD: true,
//     hasShortener: false,
//     domainEntropy: 3.45,
//     pathLength: 1,
//     queryParamCount: 0
//   }
// }
```

### Batch Analysis

```typescript
import { analyzeURLBatch } from '@malicious-url-detector/shared';

const urls = [
  'https://google.com',
  'http://phishing-site.tk',
  'http://192.168.1.1/login'
];

const results = analyzeURLBatch(urls);

results.forEach(result => {
  console.log(`${result.verdict}: ${result.riskScore}/100`);
});
```

---

## API Reference

### `analyzeURL(url: string, includeFeatures?: boolean): AnalysisResult`

Analyze a single URL for malicious content.

**Parameters:**
- `url` (string) - URL to analyze
- `includeFeatures` (boolean, optional) - Include detailed features in response (default: false)

**Returns:** `AnalysisResult`

```typescript
interface AnalysisResult {
  isValid: boolean;
  riskScore: number;              // 0-100
  verdict: 'safe' | 'suspicious' | 'malicious';
  reasons: string[];
  features?: URLFeatures;         // Only if includeFeatures=true
}
```

### `analyzeURLBatch(urls: string[], includeFeatures?: boolean): AnalysisResult[]`

Analyze multiple URLs in batch.

**Parameters:**
- `urls` (string[]) - Array of URLs to analyze
- `includeFeatures` (boolean, optional) - Include detailed features in response (default: false)

**Returns:** `AnalysisResult[]`

---

## Risk Scoring

### Verdict Thresholds

- **0-29**: `safe` ✅
- **30-69**: `suspicious` ⚠️
- **70-100**: `malicious` 🚨

### Scoring Factors

| Factor | Score Impact | Description |
|--------|--------------|-------------|
| IP Address | +25 | Using IP instead of domain |
| No HTTPS | +15 | Missing encryption |
| Suspicious TLD | +20 | High-risk domain extension |
| Phishing Keywords (3+) | +25 | Multiple suspicious terms |
| High Entropy (>4.5) | +20 | Randomly generated domain |
| Excessive Dots (>5) | +20 | Subdomain obfuscation |
| URL Shortener | +10 | Hides destination |
| Long URL (>200 chars) | +15 | Potential obfuscation |

---

## Detection Features

### Phishing Keywords (50+)

Common phishing terms detected:
- Authentication: `login`, `signin`, `verify`, `confirm`
- Urgency: `urgent`, `suspended`, `locked`, `expire`
- Incentives: `free`, `prize`, `winner`, `bonus`
- Financial: `bank`, `paypal`, `payment`, `billing`
- Actions: `update`, `activate`, `restore`, `download`

### Suspicious TLDs (20+)

High-risk domain extensions:
- Free domains: `.tk`, `.ml`, `.ga`, `.cf`, `.gq`
- Cheap domains: `.xyz`, `.top`, `.work`, `.click`, `.link`
- Risky extensions: `.loan`, `.win`, `.bid`, `.racing`, `.download`

### URL Shorteners (15+)

Known shortening services:
- `bit.ly`, `tinyurl.com`, `goo.gl`, `t.co`, `ow.ly`
- `is.gd`, `short.link`, `rebrand.ly`, `cutt.ly`

---

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm test
npm run test:coverage
```

### Lint

```bash
npm run lint
```

---

## Architecture

### Design Principles

1. **Deterministic** - Same input always produces same output
2. **Offline-Capable** - No external API dependencies
3. **Fast** - Typical analysis <10ms
4. **Extensible** - Easy to add new detection rules
5. **Type-Safe** - Full TypeScript support

### No External Dependencies

This library has **zero runtime dependencies** for maximum portability and security.

---

## Examples

### Safe URL

```typescript
analyzeURL('https://www.github.com');
// {
//   isValid: true,
//   riskScore: 0,
//   verdict: 'safe',
//   reasons: ['No suspicious patterns detected']
// }
```

### Suspicious URL

```typescript
analyzeURL('http://login-verify-account.xyz');
// {
//   isValid: true,
//   riskScore: 58,
//   verdict: 'suspicious',
//   reasons: [
//     'URL does not use HTTPS encryption',
//     'Suspicious keywords detected (2)',
//     'URL uses suspicious top-level domain'
//   ]
// }
```

### Malicious URL

```typescript
analyzeURL('http://192.168.1.1/urgent-verify-login-suspended.tk');
// {
//   isValid: true,
//   riskScore: 95,
//   verdict: 'malicious',
//   reasons: [
//     'URL uses IP address instead of domain name',
//     'URL does not use HTTPS encryption',
//     'Multiple phishing keywords detected (4)',
//     'URL uses suspicious top-level domain'
//   ]
// }
```

---

## License

MIT

---

## Contributing

Contributions welcome! Please ensure:
- All tests pass (`npm test`)
- Code coverage >80%
- TypeScript strict mode compliance
- No external runtime dependencies
