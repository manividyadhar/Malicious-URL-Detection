"""
Simple test script for the Malicious URL Detection API

Run this script to test the API with various URLs.
"""

import requests
import json
import sys

API_BASE_URL = "http://localhost:8000"


def test_health_check():
    """Test the health check endpoint."""
    print("Testing health check endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✓ Health check passed")
            print(f"  Response: {json.dumps(response.json(), indent=2)}")
            return True
        else:
            print(f"✗ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to API. Make sure the backend is running.")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def test_scan_url(url, expected_verdict=None):
    """
    Test scanning a URL.
    
    Args:
        url: URL to scan
        expected_verdict: Expected verdict (optional)
    """
    print(f"\nTesting URL: {url}")
    try:
        response = requests.post(
            f"{API_BASE_URL}/scan-url",
            json={"url": url},
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✓ Scan successful")
            print(f"  Risk Score: {result['risk_score']}/100")
            print(f"  Verdict: {result['verdict']}")
            print(f"  Processing Time: {result['processing_time_ms']}ms")
            print(f"  Reasons:")
            for reason in result['reasons']:
                print(f"    - {reason}")
            
            if expected_verdict and result['verdict'] != expected_verdict:
                print(f"  ⚠ Warning: Expected '{expected_verdict}' but got '{result['verdict']}'")
            
            return True
        else:
            print(f"✗ Scan failed: {response.status_code}")
            print(f"  Response: {response.text}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to API. Make sure the backend is running.")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def main():
    """Run all tests."""
    print("=" * 60)
    print("Malicious URL Detection API - Test Suite")
    print("=" * 60)
    
    # Test health check
    if not test_health_check():
        print("\n❌ Health check failed. Please start the backend server first.")
        print("   Run: python backend/main.py")
        sys.exit(1)
    
    # Test URLs
    test_cases = [
        ("https://www.google.com", "safe"),
        ("https://github.com", "safe"),
        ("http://account-suspended.notify.com/verify", "suspicious"),
        ("http://192.168.1.1/login/verify/account", "malicious"),
        ("https://free-prize-winner.click/claim-now", "malicious"),
    ]
    
    print("\n" + "=" * 60)
    print("Testing URL Scanning")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for url, expected_verdict in test_cases:
        if test_scan_url(url, expected_verdict):
            passed += 1
        else:
            failed += 1
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Total: {passed + failed}")
    
    if failed == 0:
        print("\n✓ All tests passed!")
        sys.exit(0)
    else:
        print("\n✗ Some tests failed.")
        sys.exit(1)


if __name__ == "__main__":
    main()
