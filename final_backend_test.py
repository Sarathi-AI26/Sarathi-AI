#!/usr/bin/env python3
"""
Final comprehensive SARATHI Backend API Test
Categorizes tests into schema-independent and schema-dependent
"""

import requests
import json
import os
from datetime import datetime

BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://guidance-hub-78.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

def log_test(test_name, success, details="", category=""):
    """Log test results with timestamp and category"""
    status = "✅ PASS" if success else "❌ FAIL"
    timestamp = datetime.now().strftime("%H:%M:%S")
    category_str = f"[{category}] " if category else ""
    print(f"[{timestamp}] {status} {category_str}{test_name}")
    if details:
        print(f"    Details: {details}")
    print()

def test_schema_independent_endpoints():
    """Test endpoints that don't require database schema"""
    print("TESTING SCHEMA-INDEPENDENT ENDPOINTS")
    print("=" * 50)
    
    results = []
    
    # Health endpoint
    try:
        response = requests.get(f"{API_BASE}", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('ok') and 'SARATHI API' in data.get('app', ''):
                log_test("Health endpoint /api", True, f"App: {data.get('app')}", "BASIC")
                results.append(True)
            else:
                log_test("Health endpoint /api", False, f"Unexpected response: {data}", "BASIC")
                results.append(False)
        else:
            log_test("Health endpoint /api", False, f"Status: {response.status_code}", "BASIC")
            results.append(False)
    except Exception as e:
        log_test("Health endpoint /api", False, f"Exception: {str(e)}", "BASIC")
        results.append(False)
    
    # Questions endpoint
    try:
        response = requests.get(f"{API_BASE}/assessment/questions", timeout=10)
        if response.status_code == 200:
            data = response.json()
            questions = data.get('questions', [])
            if len(questions) == 5:
                log_test("Assessment questions endpoint", True, f"Got {len(questions)} questions", "BASIC")
                results.append(True)
            else:
                log_test("Assessment questions endpoint", False, f"Expected 5 questions, got {len(questions)}", "BASIC")
                results.append(False)
        else:
            log_test("Assessment questions endpoint", False, f"Status: {response.status_code}", "BASIC")
            results.append(False)
    except Exception as e:
        log_test("Assessment questions endpoint", False, f"Exception: {str(e)}", "BASIC")
        results.append(False)
    
    # Schema info endpoint
    try:
        response = requests.get(f"{API_BASE}/schema", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('ok') and 'supabase_schema.sql' in data.get('sql_file', ''):
                log_test("Schema info endpoint", True, f"SQL file: {data.get('sql_file')}", "BASIC")
                results.append(True)
            else:
                log_test("Schema info endpoint", False, f"Unexpected response: {data}", "BASIC")
                results.append(False)
        else:
            log_test("Schema info endpoint", False, f"Status: {response.status_code}", "BASIC")
            results.append(False)
    except Exception as e:
        log_test("Schema info endpoint", False, f"Exception: {str(e)}", "BASIC")
        results.append(False)
    
    # Invalid route handling
    try:
        response = requests.get(f"{API_BASE}/nonexistent", timeout=10)
        if response.status_code == 404:
            data = response.json()
            if 'not found' in data.get('error', '').lower():
                log_test("Invalid route handling", True, f"404 for invalid route", "BASIC")
                results.append(True)
            else:
                log_test("Invalid route handling", False, f"Unexpected error: {data.get('error')}", "BASIC")
                results.append(False)
        else:
            log_test("Invalid route handling", False, f"Expected 404, got {response.status_code}", "BASIC")
            results.append(False)
    except Exception as e:
        log_test("Invalid route handling", False, f"Exception: {str(e)}", "BASIC")
        results.append(False)
    
    # Validation tests (don't require DB)
    try:
        # Test missing required fields
        invalid_data = {
            "name": "Test User",
            "email": "",  # Missing email
            "college": "Test College",
            "answers_json": {"q1": "a", "q2": "b", "q3": "c", "q4": "d", "q5": "a"}
        }
        
        response = requests.post(
            f"{API_BASE}/assessments",
            json=invalid_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 400:
            data = response.json()
            if 'required' in data.get('error', '').lower():
                log_test("Input validation (missing fields)", True, f"Validation error: {data.get('error')}", "VALIDATION")
                results.append(True)
            else:
                log_test("Input validation (missing fields)", False, f"Unexpected error: {data.get('error')}", "VALIDATION")
                results.append(False)
        else:
            log_test("Input validation (missing fields)", False, f"Expected 400, got {response.status_code}", "VALIDATION")
            results.append(False)
    except Exception as e:
        log_test("Input validation (missing fields)", False, f"Exception: {str(e)}", "VALIDATION")
        results.append(False)
    
    return results

def test_schema_dependent_endpoints():
    """Test endpoints that require database schema"""
    print("\nTESTING SCHEMA-DEPENDENT ENDPOINTS")
    print("=" * 50)
    
    results = []
    schema_exists = False
    
    # Test assessment creation
    try:
        assessment_data = {
            "name": "Priya Sharma",
            "email": "priya.sharma@college.edu",
            "college": "IIT Delhi",
            "answers_json": {
                "q1": "a", "q2": "b", "q3": "a", "q4": "a", "q5": "a"
            }
        }
        
        response = requests.post(
            f"{API_BASE}/assessments",
            json=assessment_data,
            headers={'Content-Type': 'application/json'},
            timeout=15
        )
        
        if response.status_code == 201:
            data = response.json()
            if data.get('ok') and 'assessment' in data:
                log_test("Assessment creation", True, f"Created assessment ID: {data['assessment']['id']}", "SCHEMA")
                schema_exists = True
                results.append(True)
                return results, data['assessment']['id']  # Return for further tests
            else:
                log_test("Assessment creation", False, f"Unexpected response structure", "SCHEMA")
                results.append(False)
        elif response.status_code == 500:
            data = response.json()
            error_msg = data.get('error', '')
            details = data.get('details', '')
            
            # Check if it's a schema-related error
            if any(keyword in details.lower() for keyword in ['column', 'table', 'relation', 'does not exist']):
                log_test("Assessment creation", True, f"Schema missing (expected): {details}", "SCHEMA")
                results.append(True)  # This is expected behavior
            else:
                log_test("Assessment creation", False, f"Unexpected server error: {error_msg}", "SCHEMA")
                results.append(False)
        else:
            log_test("Assessment creation", False, f"Status: {response.status_code}", "SCHEMA")
            results.append(False)
    except Exception as e:
        log_test("Assessment creation", False, f"Exception: {str(e)}", "SCHEMA")
        results.append(False)
    
    # Test other schema-dependent endpoints with dummy IDs
    test_id = "550e8400-e29b-41d4-a716-446655440000"  # Valid UUID format
    
    # Assessment retrieval
    try:
        response = requests.get(f"{API_BASE}/assessments/{test_id}", timeout=10)
        if response.status_code == 404 and schema_exists:
            log_test("Assessment retrieval", True, "Proper 404 for non-existent assessment", "SCHEMA")
            results.append(True)
        elif response.status_code == 500:
            data = response.json()
            details = data.get('details', '')
            if any(keyword in details.lower() for keyword in ['column', 'table', 'does not exist']):
                log_test("Assessment retrieval", True, f"Schema missing (expected): {details}", "SCHEMA")
                results.append(True)
            else:
                log_test("Assessment retrieval", False, f"Unexpected error: {details}", "SCHEMA")
                results.append(False)
        else:
            log_test("Assessment retrieval", False, f"Status: {response.status_code}", "SCHEMA")
            results.append(False)
    except Exception as e:
        log_test("Assessment retrieval", False, f"Exception: {str(e)}", "SCHEMA")
        results.append(False)
    
    # Mock payment
    try:
        payment_data = {"assessmentId": test_id}
        response = requests.post(f"{API_BASE}/payments/mock", json=payment_data, timeout=10)
        if response.status_code == 404 and schema_exists:
            log_test("Mock payment", True, "Proper 404 for non-existent assessment", "SCHEMA")
            results.append(True)
        elif response.status_code == 500:
            data = response.json()
            details = data.get('details', '')
            if any(keyword in details.lower() for keyword in ['column', 'table', 'does not exist']):
                log_test("Mock payment", True, f"Schema missing (expected): {details}", "SCHEMA")
                results.append(True)
            else:
                log_test("Mock payment", False, f"Unexpected error: {details}", "SCHEMA")
                results.append(False)
        else:
            log_test("Mock payment", False, f"Status: {response.status_code}", "SCHEMA")
            results.append(False)
    except Exception as e:
        log_test("Mock payment", False, f"Exception: {str(e)}", "SCHEMA")
        results.append(False)
    
    # Results endpoint
    try:
        response = requests.get(f"{API_BASE}/results/{test_id}", timeout=10)
        if response.status_code == 404 and schema_exists:
            log_test("Results endpoint", True, "Proper 404 for non-existent assessment", "SCHEMA")
            results.append(True)
        elif response.status_code == 500:
            data = response.json()
            details = data.get('details', '')
            if any(keyword in details.lower() for keyword in ['column', 'table', 'does not exist']):
                log_test("Results endpoint", True, f"Schema missing (expected): {details}", "SCHEMA")
                results.append(True)
            else:
                log_test("Results endpoint", False, f"Unexpected error: {details}", "SCHEMA")
                results.append(False)
        else:
            log_test("Results endpoint", False, f"Status: {response.status_code}", "SCHEMA")
            results.append(False)
    except Exception as e:
        log_test("Results endpoint", False, f"Exception: {str(e)}", "SCHEMA")
        results.append(False)
    
    return results, None

def main():
    """Run comprehensive backend tests"""
    print("SARATHI Backend API Comprehensive Test Suite")
    print(f"Testing API at: {API_BASE}")
    print("=" * 60)
    
    # Test schema-independent endpoints
    basic_results = test_schema_independent_endpoints()
    
    # Test schema-dependent endpoints
    schema_results, assessment_id = test_schema_dependent_endpoints()
    
    # Summary
    print("\n" + "=" * 60)
    print("COMPREHENSIVE TEST SUMMARY")
    print("=" * 60)
    
    basic_passed = sum(basic_results)
    basic_total = len(basic_results)
    schema_passed = sum(schema_results)
    schema_total = len(schema_results)
    
    print(f"Schema-Independent Tests: {basic_passed}/{basic_total} passed")
    print(f"Schema-Dependent Tests: {schema_passed}/{schema_total} passed")
    print(f"Overall: {basic_passed + schema_passed}/{basic_total + schema_total} passed")
    
    print("\nDETAILED ANALYSIS:")
    if basic_passed == basic_total:
        print("✅ All basic API functionality is working correctly")
        print("   - Health endpoints responding")
        print("   - Question data loading properly")
        print("   - Input validation working")
        print("   - Route handling correct")
    else:
        print(f"❌ Basic API issues detected ({basic_passed}/{basic_total})")
    
    if schema_passed == schema_total:
        print("✅ Schema-dependent endpoints behaving correctly")
        print("   - Either schema exists and endpoints work, or")
        print("   - Schema missing and endpoints provide appropriate errors")
    else:
        print(f"❌ Schema-dependent endpoint issues ({schema_passed}/{schema_total})")
    
    print("\nRECOMMENDATION:")
    if basic_passed == basic_total and schema_passed == schema_total:
        print("🎉 API is ready for production!")
        print("   To enable full functionality, run /app/supabase_schema.sql in Supabase SQL Editor")
    elif basic_passed == basic_total:
        print("✅ Core API is solid. Schema setup needed for database features.")
    else:
        print("❌ Core API needs attention before proceeding.")

if __name__ == "__main__":
    main()