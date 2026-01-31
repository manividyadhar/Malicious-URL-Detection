# API Usage Examples

## Using cURL

### 1. Scan a Safe URL

```bash
curl -X POST "http://localhost:8000/scan-url" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'
```

**Expected Response:**
```json
{
  "url": "https://www.google.com",
  "risk_score": 5,
  "verdict": "safe",
  "reasons": ["No suspicious patterns detected"],
  "ml_confidence": null,
  "processing_time_ms": 8.45
}
```

### 2. Scan a Suspicious URL

```bash
curl -X POST "http://localhost:8000/scan-url" \
  -H "Content-Type: application/json" \
  -d '{"url": "http://account-suspended.notify.com/verify"}'
```

**Expected Response:**
```json
{
  "url": "http://account-suspended.notify.com/verify",
  "risk_score": 48,
  "verdict": "suspicious",
  "reasons": [
    "Suspicious keywords detected (2)",
    "URL does not use HTTPS encryption",
    "Multiple subdomains (1)"
  ],
  "ml_confidence": null,
  "processing_time_ms": 10.23
}
```

### 3. Scan a Malicious URL

```bash
curl -X POST "http://localhost:8000/scan-url" \
  -H "Content-Type: application/json" \
  -d '{"url": "http://192.168.1.1/login/verify/account"}'
```

**Expected Response:**
```json
{
  "url": "http://192.168.1.1/login/verify/account",
  "risk_score": 73,
  "verdict": "malicious",
  "reasons": [
    "URL contains IP address instead of domain name",
    "Suspicious keywords detected (2)",
    "URL does not use HTTPS encryption"
  ],
  "ml_confidence": null,
  "processing_time_ms": 9.87
}
```

### 4. Using GET Method

```bash
curl "http://localhost:8000/scan-url?url=https://www.github.com"
```

### 5. Health Check

```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "ml_model_loaded": false
}
```

## Using Python

```python
import requests

# API base URL
API_URL = "http://localhost:8000"

# Scan a URL
def scan_url(url):
    response = requests.post(
        f"{API_URL}/scan-url",
        json={"url": url}
    )
    return response.json()

# Example usage
result = scan_url("https://www.google.com")
print(f"Risk Score: {result['risk_score']}")
print(f"Verdict: {result['verdict']}")
print(f"Reasons: {result['reasons']}")
```

## Using JavaScript (Browser/Fetch)

```javascript
async function scanURL(url) {
  const response = await fetch('http://localhost:8000/scan-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: url }),
  });
  
  const data = await response.json();
  return data;
}

// Example usage
scanURL('https://www.example.com')
  .then(result => {
    console.log('Risk Score:', result.risk_score);
    console.log('Verdict:', result.verdict);
    console.log('Reasons:', result.reasons);
  })
  .catch(error => console.error('Error:', error));
```

## Using Python requests library (batch scanning)

```python
import requests
import json

def batch_scan_urls(urls):
    results = []
    for url in urls:
        try:
            response = requests.post(
                "http://localhost:8000/scan-url",
                json={"url": url},
                timeout=5
            )
            result = response.json()
            results.append(result)
        except Exception as e:
            results.append({"url": url, "error": str(e)})
    return results

# Example
urls = [
    "https://www.google.com",
    "http://192.168.1.1/login",
    "https://suspicious-site.com"
]

results = batch_scan_urls(urls)
for result in results:
    print(json.dumps(result, indent=2))
```

## Error Handling

```python
import requests

def scan_url_safe(url):
    try:
        response = requests.post(
            "http://localhost:8000/scan-url",
            json={"url": url},
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        return {"error": "Request timeout"}
    except requests.exceptions.ConnectionError:
        return {"error": "Cannot connect to API"}
    except requests.exceptions.HTTPError as e:
        return {"error": f"HTTP error: {e.response.status_code}"}
    except Exception as e:
        return {"error": str(e)}
```
