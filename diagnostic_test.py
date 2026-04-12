#!/usr/bin/env python3
"""
Detailed diagnostic test for SARATHI API
"""

import requests
import json
import os

BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://guidance-hub-78.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

def test_assessment_creation_detailed():
    """Test assessment creation with detailed error logging"""
    print("Testing assessment creation with detailed error logging...")
    
    assessment_data = {
        "name": "Priya Sharma",
        "email": "priya.sharma@college.edu",
        "college": "IIT Delhi",
        "answers_json": {
            "q1": "a",
            "q2": "b", 
            "q3": "a",
            "q4": "a",
            "q5": "a"
        }
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/assessments",
            json=assessment_data,
            headers={'Content-Type': 'application/json'},
            timeout=15
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        try:
            data = response.json()
            print(f"Response Body: {json.dumps(data, indent=2)}")
        except:
            print(f"Raw Response: {response.text}")
            
        return response.status_code, response.text
        
    except Exception as e:
        print(f"Exception during request: {str(e)}")
        return None, str(e)

def test_supabase_connection():
    """Test if we can detect Supabase connection issues"""
    print("\nTesting Supabase connection through a simple endpoint...")
    
    try:
        # Try to get assessment questions first (doesn't require DB)
        response = requests.get(f"{API_BASE}/assessment/questions", timeout=10)
        print(f"Questions endpoint status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Basic API routing is working")
        else:
            print("❌ Basic API routing has issues")
            
    except Exception as e:
        print(f"Exception: {str(e)}")

if __name__ == "__main__":
    print("SARATHI API Diagnostic Test")
    print("=" * 50)
    
    test_supabase_connection()
    status_code, response_text = test_assessment_creation_detailed()
    
    print("\n" + "=" * 50)
    print("DIAGNOSIS:")
    
    if status_code == 500:
        try:
            data = json.loads(response_text)
            error_msg = data.get('error', '')
            details = data.get('details', '')
            
            if 'schema' in error_msg.lower() or 'table' in details.lower():
                print("🔍 SCHEMA ISSUE: Supabase tables don't exist yet")
                print("   The API is correctly detecting missing schema and providing hints")
                print("   This is expected behavior when schema hasn't been applied")
            else:
                print("🔍 SUPABASE CONNECTION ISSUE:")
                print(f"   Error: {error_msg}")
                print(f"   Details: {details}")
        except:
            print("🔍 UNKNOWN SERVER ERROR")
            print(f"   Raw response: {response_text}")
    elif status_code == 201:
        print("✅ ASSESSMENT CREATION WORKING: Schema exists and API is functional")
    else:
        print(f"🔍 UNEXPECTED STATUS: {status_code}")
        print(f"   Response: {response_text}")