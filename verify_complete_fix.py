"""
Complete verification script for the extension-backend connection fix.
Tests all aspects of the connection to ensure everything works.
"""

import requests
import sys
import time
from typing import Tuple, List

API_URLS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000"
]

def print_header(text: str):
    """Print a formatted header."""
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)

def print_success(text: str):
    """Print success message."""
    print(f"✅ {text}")

def print_error(text: str):
    """Print error message."""
    print(f"❌ {text}")

def print_warning(text: str):
    """Print warning message."""
    print(f"⚠️  {text}")

def test_backend_running() -> Tuple[bool, str]:
    """Test if backend is running on any URL."""
    print_header("Test 1: Backend Server Status")
    
    for url in API_URLS:
        try:
            response = requests.get(f"{url}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                print_success(f"Backend is running at {url}")
                print(f"   Status: {data.get('status', 'unknown')}")
                return True, url
        except requests.exceptions.ConnectionError:
            print_warning(f"Cannot connect to {url}")
        except Exception as e:
            print_error(f"Error testing {url}: {e}")
    
    print_error("Backend is NOT running!")
    print("\n💡 To start the backend:")
    print("   1. cd backend")
    print("   2. python main.py")
    return False, ""

def test_cors_preflight(base_url: str) -> bool:
    """Test CORS preflight (OPTIONS) request."""
    print_header("Test 2: CORS Preflight (OPTIONS)")
    
    try:
        # Test OPTIONS for /health
        response = requests.options(
            f"{base_url}/health",
            headers={
                "Origin": "chrome-extension://test",
                "Access-Control-Request-Method": "GET",
            },
            timeout=5
        )
        
        cors_headers = {
            "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
            "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
            "Access-Control-Allow-Headers": response.headers.get("Access-Control-Allow-Headers"),
        }
        
        if response.status_code in [200, 204]:
            print_success("OPTIONS request successful")
            for header, value in cors_headers.items():
                if value:
                    print(f"   {header}: {value}")
                else:
                    print_warning(f"{header}: Not found")
            return True
        else:
            print_error(f"OPTIONS returned status {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"CORS preflight test failed: {e}")
        return False

def test_post_request(base_url: str) -> bool:
    """Test POST request to /scan-url."""
    print_header("Test 3: POST Request to /scan-url")
    
    try:
        response = requests.post(
            f"{base_url}/scan-url",
            json={"url": "https://www.google.com"},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("POST request successful")
            print(f"   URL: {data.get('url', 'N/A')}")
            print(f"   Risk Score: {data.get('risk_score', 'N/A')}/100")
            print(f"   Verdict: {data.get('verdict', 'N/A')}")
            return True
        else:
            print_error(f"POST returned status {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False
            
    except Exception as e:
        print_error(f"POST request failed: {e}")
        return False

def test_test_connection_endpoint(base_url: str) -> bool:
    """Test the new test-connection endpoint."""
    print_header("Test 4: Test Connection Endpoint")
    
    try:
        response = requests.get(f"{base_url}/test-connection", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print_success("Test connection endpoint works")
            print(f"   Message: {data.get('message', 'N/A')}")
            return True
        else:
            print_error(f"Test connection returned status {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Test connection failed: {e}")
        return False

def test_multiple_requests(base_url: str) -> bool:
    """Test multiple rapid requests (simulates extension usage)."""
    print_header("Test 5: Multiple Rapid Requests")
    
    test_urls = [
        "https://www.google.com",
        "https://www.github.com",
        "http://192.168.1.1/login"  # Suspicious pattern
    ]
    
    success_count = 0
    for i, url in enumerate(test_urls, 1):
        try:
            response = requests.post(
                f"{base_url}/scan-url",
                json={"url": url},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                print_success(f"Request {i}/{len(test_urls)}: {data.get('verdict', 'N/A')}")
                success_count += 1
            else:
                print_error(f"Request {i} failed: HTTP {response.status_code}")
        except Exception as e:
            print_error(f"Request {i} error: {e}")
    
    if success_count == len(test_urls):
        print_success(f"All {len(test_urls)} requests succeeded")
        return True
    else:
        print_warning(f"Only {success_count}/{len(test_urls)} requests succeeded")
        return False

def main():
    """Run all verification tests."""
    print("=" * 70)
    print("  Complete Extension-Backend Connection Verification")
    print("=" * 70)
    
    # Test 1: Backend running
    backend_ok, base_url = test_backend_running()
    if not backend_ok:
        print("\n" + "=" * 70)
        print("❌ VERIFICATION FAILED: Backend is not running")
        print("=" * 70)
        print("\nPlease start the backend first:")
        print("  cd backend")
        print("  python main.py")
        sys.exit(1)
    
    # Run remaining tests
    results = []
    results.append(("Backend Running", True))
    results.append(("CORS Preflight", test_cors_preflight(base_url)))
    results.append(("POST Request", test_post_request(base_url)))
    results.append(("Test Connection", test_test_connection_endpoint(base_url)))
    results.append(("Multiple Requests", test_multiple_requests(base_url)))
    
    # Summary
    print_header("Verification Summary")
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status}: {test_name}")
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n" + "=" * 70)
        print("✅ ALL TESTS PASSED!")
        print("=" * 70)
        print("\nNext steps:")
        print("  1. Reload your browser extension")
        print("  2. Check service worker console for initialization")
        print("  3. Test scanning a URL from extension popup")
        sys.exit(0)
    else:
        print("\n" + "=" * 70)
        print("⚠️  SOME TESTS FAILED")
        print("=" * 70)
        print("\nPlease fix the failing tests before using the extension.")
        sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nVerification cancelled by user.")
        sys.exit(1)
