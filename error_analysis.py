#!/usr/bin/env python3
"""
Detailed error analysis for all endpoints
"""

import requests
import json
import os

BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://guidance-hub-78.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

def analyze_endpoint_errors():
    """Analyze detailed error responses from all endpoints"""
    
    print("Analyzing detailed error responses...")
    print("=" * 50)
    
    # Test assessment retrieval
    print("1. Assessment Retrieval Error:")
    response = requests.get(f"{API_BASE}/assessments/test-id", timeout=10)
    print(f"   Status: {response.status_code}")
    try:
        data = response.json()
        print(f"   Response: {json.dumps(data, indent=4)}")
    except:
        print(f"   Raw: {response.text}")
    
    print("\n" + "-" * 30)
    
    # Test payment error
    print("2. Payment Error:")
    payment_data = {"assessmentId": "test-id"}
    response = requests.post(f"{API_BASE}/payments/mock", json=payment_data, timeout=10)
    print(f"   Status: {response.status_code}")
    try:
        data = response.json()
        print(f"   Response: {json.dumps(data, indent=4)}")
    except:
        print(f"   Raw: {response.text}")
    
    print("\n" + "-" * 30)
    
    # Test results error
    print("3. Results Error:")
    response = requests.get(f"{API_BASE}/results/test-id", timeout=10)
    print(f"   Status: {response.status_code}")
    try:
        data = response.json()
        print(f"   Response: {json.dumps(data, indent=4)}")
    except:
        print(f"   Raw: {response.text}")

if __name__ == "__main__":
    analyze_endpoint_errors()