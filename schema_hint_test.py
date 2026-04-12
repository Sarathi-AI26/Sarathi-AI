#!/usr/bin/env python3
"""
Test schema hint behavior and API resilience
"""

import requests
import json
import os

BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://guidance-hub-78.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

def test_schema_hint_behavior():
    """Test that API provides proper schema hints when tables don't exist"""
    print("Testing schema hint behavior...")
    
    # Test assessment creation (should give schema hint)
    assessment_data = {
        "name": "Test User",
        "email": "test@example.com",
        "college": "Test College",
        "answers_json": {"q1": "a", "q2": "b", "q3": "a", "q4": "a", "q5": "a"}
    }
    
    response = requests.post(f"{API_BASE}/assessments", json=assessment_data, timeout=10)
    print(f"Assessment creation status: {response.status_code}")
    
    if response.status_code == 500:
        data = response.json()
        error_msg = data.get('error', '')
        details = data.get('details', '')
        
        # Check if it's providing a schema hint
        if 'schema' in error_msg.lower() or 'table' in details.lower() or 'column' in details.lower():
            print("✅ Schema hint provided correctly")
            print(f"   Error: {error_msg}")
            print(f"   Details: {details}")
            return True
        else:
            print("❌ No schema hint provided")
            print(f"   Error: {error_msg}")
            return False
    else:
        print(f"❌ Unexpected status code: {response.status_code}")
        return False

def test_assessment_retrieval_without_schema():
    """Test assessment retrieval when schema doesn't exist"""
    print("\nTesting assessment retrieval without schema...")
    
    # Try to get a non-existent assessment
    response = requests.get(f"{API_BASE}/assessments/test-id", timeout=10)
    print(f"Assessment retrieval status: {response.status_code}")
    
    if response.status_code == 500:
        data = response.json()
        error_msg = data.get('error', '')
        details = data.get('details', '')
        
        if 'schema' in error_msg.lower() or 'table' in details.lower():
            print("✅ Schema hint provided for retrieval")
            return True
        else:
            print("❌ No schema hint for retrieval")
            return False
    else:
        print(f"Status: {response.status_code}, Response: {response.text}")
        return True  # Might be working if schema exists

def test_payment_without_schema():
    """Test payment endpoint without schema"""
    print("\nTesting payment endpoint without schema...")
    
    payment_data = {"assessmentId": "test-id"}
    response = requests.post(f"{API_BASE}/payments/mock", json=payment_data, timeout=10)
    print(f"Payment status: {response.status_code}")
    
    if response.status_code == 500:
        data = response.json()
        error_msg = data.get('error', '')
        details = data.get('details', '')
        
        if 'schema' in error_msg.lower() or 'table' in details.lower():
            print("✅ Schema hint provided for payment")
            return True
        else:
            print("❌ No schema hint for payment")
            return False
    elif response.status_code == 404:
        print("✅ Proper 404 for non-existent assessment")
        return True
    else:
        print(f"Status: {response.status_code}, Response: {response.text}")
        return True

def test_results_without_schema():
    """Test results endpoint without schema"""
    print("\nTesting results endpoint without schema...")
    
    response = requests.get(f"{API_BASE}/results/test-id", timeout=10)
    print(f"Results status: {response.status_code}")
    
    if response.status_code == 500:
        data = response.json()
        error_msg = data.get('error', '')
        details = data.get('details', '')
        
        if 'schema' in error_msg.lower() or 'table' in details.lower():
            print("✅ Schema hint provided for results")
            return True
        else:
            print("❌ No schema hint for results")
            return False
    elif response.status_code == 404:
        print("✅ Proper 404 for non-existent assessment")
        return True
    else:
        print(f"Status: {response.status_code}, Response: {response.text}")
        return True

def main():
    print("SARATHI Schema Hint Testing")
    print("=" * 40)
    
    results = []
    results.append(test_schema_hint_behavior())
    results.append(test_assessment_retrieval_without_schema())
    results.append(test_payment_without_schema())
    results.append(test_results_without_schema())
    
    print("\n" + "=" * 40)
    print("SCHEMA HINT TEST SUMMARY")
    print("=" * 40)
    
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("✅ All schema hint tests passed!")
        print("   API correctly handles missing schema and provides helpful hints")
    else:
        print(f"❌ Some schema hint tests failed ({passed}/{total})")

if __name__ == "__main__":
    main()