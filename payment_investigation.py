#!/usr/bin/env python3
"""
Quick investigation of the payment endpoint 404 issue
"""

import requests
import json
import os

BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://guidance-hub-78.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

def investigate_payment_404():
    """Investigate why payment endpoint returns 404"""
    
    test_id = "550e8400-e29b-41d4-a716-446655440000"  # Valid UUID format
    
    print("Testing payment endpoint with valid UUID...")
    payment_data = {"assessmentId": test_id}
    response = requests.post(f"{API_BASE}/payments/mock", json=payment_data, timeout=10)
    
    print(f"Status: {response.status_code}")
    try:
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
    except:
        print(f"Raw response: {response.text}")
    
    # Test with invalid UUID format
    print("\nTesting payment endpoint with invalid UUID...")
    payment_data = {"assessmentId": "invalid-id"}
    response = requests.post(f"{API_BASE}/payments/mock", json=payment_data, timeout=10)
    
    print(f"Status: {response.status_code}")
    try:
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
    except:
        print(f"Raw response: {response.text}")

if __name__ == "__main__":
    investigate_payment_404()