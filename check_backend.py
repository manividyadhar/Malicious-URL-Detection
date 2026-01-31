"""
Quick script to check if the backend is running and accessible.
Run this to verify your backend setup before using the extension.
"""

import requests
import sys

API_URL = "http://localhost:8000"

def check_backend():
    """Check if backend is running and accessible."""
    print("=" * 60)
    print("Backend Connection Checker")
    print("=" * 60)
    print(f"\nChecking: {API_URL}\n")
    
    try:
        # Test health endpoint
        print("1. Testing health endpoint...")
        response = requests.get(f"{API_URL}/health", timeout=5)
        
        if response.status_code == 200:
            print("   ✅ Backend is running and healthy!")
            data = response.json()
            print(f"   Status: {data.get('status')}")
            print(f"   ML Model: {data.get('ml_model_loaded', False)}")
        else:
            print(f"   ⚠️  Backend responded with status: {response.status_code}")
            return False
        
        # Test scan endpoint
        print("\n2. Testing scan endpoint...")
        test_response = requests.post(
            f"{API_URL}/scan-url",
            json={"url": "https://www.google.com"},
            timeout=10
        )
        
        if test_response.status_code == 200:
            result = test_response.json()
            print("   ✅ Scan endpoint is working!")
            print(f"   Test URL: {result['url']}")
            print(f"   Risk Score: {result['risk_score']}/100")
            print(f"   Verdict: {result['verdict']}")
        else:
            print(f"   ⚠️  Scan endpoint returned status: {test_response.status_code}")
            return False
        
        print("\n" + "=" * 60)
        print("✅ All checks passed! Backend is ready to use.")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Keep this backend running (don't close the terminal)")
        print("2. Reload your browser extension")
        print("3. Try scanning a URL!")
        return True
        
    except requests.exceptions.ConnectionError:
        print("   ❌ Cannot connect to backend!")
        print("\n" + "=" * 60)
        print("❌ Backend is NOT running")
        print("=" * 60)
        print("\nTo start the backend:")
        print("1. Open a terminal/command prompt")
        print("2. Navigate to the backend folder:")
        print("   cd backend")
        print("3. Start the server:")
        print("   python main.py")
        print("4. Wait for: 'Uvicorn running on http://0.0.0.0:8000'")
        print("5. Then run this check again")
        return False
        
    except requests.exceptions.Timeout:
        print("   ❌ Request timed out!")
        print("   The backend might be slow or unresponsive")
        return False
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

if __name__ == "__main__":
    try:
        success = check_backend()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\nCheck cancelled by user.")
        sys.exit(1)
