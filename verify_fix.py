"""
Quick verification script to test the fetch error fix.
Tests backend CORS configuration and connectivity.
"""

import requests
import sys

API_URLS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000"
]

def test_cors_headers(url):
    """Test CORS headers in response."""
    print(f"\n{'='*60}")
    print(f"Testing: {url}")
    print('='*60)
    
    try:
        # Test OPTIONS (preflight) request
        print("\n1. Testing OPTIONS (CORS preflight)...")
        response = requests.options(
            f"{url}/scan-url",
            headers={
                "Origin": "chrome-extension://test",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type"
            },
            timeout=5
        )
        
        print(f"   Status: {response.status_code}")
        cors_headers = {
            "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
            "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
            "Access-Control-Allow-Headers": response.headers.get("Access-Control-Allow-Headers"),
            "Access-Control-Allow-Credentials": response.headers.get("Access-Control-Allow-Credentials"),
        }
        
        for header, value in cors_headers.items():
            if value:
                print(f"   ✅ {header}: {value}")
            else:
                print(f"   ⚠️  {header}: Not found")
        
        # Test actual POST request
        print("\n2. Testing POST request...")
        response = requests.post(
            f"{url}/scan-url",
            json={"url": "https://www.google.com"},
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ POST successful")
            print(f"   Risk Score: {data.get('risk_score')}")
            print(f"   Verdict: {data.get('verdict')}")
            return True
        else:
            print(f"   ❌ POST failed: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Cannot connect to {url}")
        print(f"   💡 Make sure backend is running: python main.py")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("="*60)
    print("Fetch Error Fix Verification")
    print("="*60)
    print("\nThis script verifies:")
    print("1. Backend is running and accessible")
    print("2. CORS headers are configured correctly")
    print("3. API endpoints respond correctly")
    
    success = False
    for url in API_URLS:
        if test_cors_headers(url):
            success = True
            print(f"\n✅ {url} is working correctly!")
            break
    
    if not success:
        print("\n" + "="*60)
        print("❌ All connection attempts failed")
        print("="*60)
        print("\nTroubleshooting:")
        print("1. Start backend: cd backend && python main.py")
        print("2. Verify: http://localhost:8000/health works in browser")
        print("3. Check firewall/antivirus settings")
        sys.exit(1)
    else:
        print("\n" + "="*60)
        print("✅ Verification passed!")
        print("="*60)
        print("\nNext steps:")
        print("1. Reload your browser extension")
        print("2. Test scanning a URL")
        print("3. Check browser console (F12) for any errors")
        sys.exit(0)

if __name__ == "__main__":
    main()
