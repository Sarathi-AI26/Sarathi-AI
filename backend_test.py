#!/usr/bin/env python3
"""
SARATHI Backend Testing - AI Roadmap Stability Testing
Testing the stabilized Gemini roadmap integration after 502 fixes
"""

import asyncio
import json
import os
import requests
import time
from typing import Dict, Any, Optional

# Test configuration
BASE_URL = "https://guidance-hub-78.preview.emergentagent.com/api"
TIMEOUT = 180  # 3 minutes for AI generation

class SarathiBackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'SARATHI-Backend-Tester/1.0'
        })
        
    def log(self, message: str, level: str = "INFO"):
        timestamp = time.strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def test_api_health(self) -> bool:
        """Test basic API health"""
        try:
            response = self.session.get(f"{self.base_url}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                self.log(f"✅ API Health: {data.get('message', 'OK')}")
                return True
            else:
                self.log(f"❌ API Health failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ API Health error: {str(e)}", "ERROR")
            return False
    
    def create_test_assessment(self) -> Optional[str]:
        """Create a test assessment for AI generation testing"""
        try:
            # Use realistic test data as per instructions
            test_data = {
                "name": "Arjun Patel",
                "email": f"arjun.patel.test.{int(time.time())}@iitdelhi.ac.in",
                "college": "IIT Delhi",
                "answers_json": {
                    "q1": "b",  # Technical problem-solving
                    "q2": "a",  # Leadership in group projects
                    "q3": "c",  # Data analysis and insights
                    "q4": "b",  # Structured approach to challenges
                    "q5": "a"   # Innovation and technology
                }
            }
            
            response = self.session.post(f"{self.base_url}/assessments", json=test_data, timeout=30)
            
            if response.status_code == 201:
                data = response.json()
                assessment_id = data['assessment']['id']
                self.log(f"✅ Assessment created: {assessment_id}")
                return assessment_id
            else:
                self.log(f"❌ Assessment creation failed: {response.status_code} - {response.text}", "ERROR")
                return None
                
        except Exception as e:
            self.log(f"❌ Assessment creation error: {str(e)}", "ERROR")
            return None
    
    def process_mock_payment(self, assessment_id: str) -> bool:
        """Process mock payment for assessment"""
        try:
            payment_data = {"assessmentId": assessment_id}
            response = self.session.post(f"{self.base_url}/payments/mock", json=payment_data, timeout=30)
            
            if response.status_code == 200:
                self.log(f"✅ Mock payment processed for {assessment_id}")
                return True
            else:
                self.log(f"❌ Mock payment failed: {response.status_code} - {response.text}", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"❌ Mock payment error: {str(e)}", "ERROR")
            return False
    
    def generate_ai_roadmap(self, assessment_id: str, attempt_num: int = 1) -> Dict[str, Any]:
        """Generate AI roadmap and test stability"""
        try:
            self.log(f"🤖 Starting AI roadmap generation #{attempt_num} for {assessment_id}")
            
            generation_data = {"assessmentId": assessment_id}
            start_time = time.time()
            
            response = self.session.post(
                f"{self.base_url}/generate-roadmap", 
                json=generation_data, 
                timeout=TIMEOUT
            )
            
            generation_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                assessment = data.get('assessment', {})
                ai_analysis = assessment.get('ai_analysis', {})
                
                # Verify required AI fields are present
                required_fields = [
                    'user_archetype', 'executive_summary', 'psychometric_profile',
                    'top_career_matches', 'one_year_roadmap', 'potential_blind_spots'
                ]
                
                missing_fields = [field for field in required_fields if not ai_analysis.get(field)]
                
                if missing_fields:
                    self.log(f"❌ AI generation #{attempt_num} missing fields: {missing_fields}", "ERROR")
                    return {
                        "success": False,
                        "status_code": response.status_code,
                        "error": f"Missing required fields: {missing_fields}",
                        "generation_time": generation_time
                    }
                
                # Verify career matches structure
                career_matches = ai_analysis.get('top_career_matches', [])
                if not isinstance(career_matches, list) or len(career_matches) == 0:
                    self.log(f"❌ AI generation #{attempt_num} invalid career matches structure", "ERROR")
                    return {
                        "success": False,
                        "status_code": response.status_code,
                        "error": "Invalid career matches structure",
                        "generation_time": generation_time
                    }
                
                # Verify roadmap structure
                roadmap = ai_analysis.get('one_year_roadmap', {})
                roadmap_quarters = ['q1_focus', 'q2_focus', 'q3_focus', 'q4_focus']
                missing_quarters = [q for q in roadmap_quarters if not roadmap.get(q)]
                
                if missing_quarters:
                    self.log(f"❌ AI generation #{attempt_num} missing roadmap quarters: {missing_quarters}", "ERROR")
                    return {
                        "success": False,
                        "status_code": response.status_code,
                        "error": f"Missing roadmap quarters: {missing_quarters}",
                        "generation_time": generation_time
                    }
                
                self.log(f"✅ AI generation #{attempt_num} successful in {generation_time:.1f}s")
                self.log(f"   User Archetype: {ai_analysis.get('user_archetype', 'N/A')}")
                self.log(f"   Career Matches: {len(career_matches)} found")
                self.log(f"   Cached: {data.get('cached', False)}")
                
                return {
                    "success": True,
                    "status_code": response.status_code,
                    "assessment_id": assessment_id,
                    "ai_analysis": ai_analysis,
                    "cached": data.get('cached', False),
                    "generation_time": generation_time
                }
                
            else:
                error_text = response.text
                self.log(f"❌ AI generation #{attempt_num} failed: {response.status_code} - {error_text}", "ERROR")
                
                # Check for specific 502 errors that were being fixed
                if response.status_code == 502:
                    self.log(f"⚠️  502 Error detected - this was the issue being fixed!", "WARNING")
                
                return {
                    "success": False,
                    "status_code": response.status_code,
                    "error": error_text,
                    "generation_time": generation_time
                }
                
        except requests.exceptions.Timeout:
            self.log(f"❌ AI generation #{attempt_num} timed out after {TIMEOUT}s", "ERROR")
            return {
                "success": False,
                "status_code": 408,
                "error": "Request timeout",
                "generation_time": TIMEOUT
            }
        except Exception as e:
            self.log(f"❌ AI generation #{attempt_num} error: {str(e)}", "ERROR")
            return {
                "success": False,
                "status_code": 500,
                "error": str(e),
                "generation_time": 0
            }
    
    def verify_ai_persistence(self, assessment_id: str) -> bool:
        """Verify AI analysis is properly persisted and retrievable"""
        try:
            response = self.session.get(f"{self.base_url}/results/{assessment_id}", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                assessment = data.get('assessment', {})
                ai_analysis = assessment.get('ai_analysis', {})
                
                # Check if real AI data is present (not mock data)
                has_real_ai = bool(
                    ai_analysis.get('user_archetype') and
                    isinstance(ai_analysis.get('top_career_matches'), list) and
                    len(ai_analysis.get('top_career_matches', [])) > 0
                )
                
                if has_real_ai:
                    self.log(f"✅ AI analysis properly persisted for {assessment_id}")
                    return True
                else:
                    self.log(f"❌ AI analysis not found or incomplete for {assessment_id}", "ERROR")
                    return False
            else:
                self.log(f"❌ Results retrieval failed: {response.status_code} - {response.text}", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"❌ AI persistence verification error: {str(e)}", "ERROR")
            return False
    
    def run_stability_test(self, num_generations: int = 3) -> Dict[str, Any]:
        """Run multiple AI generations to test stability"""
        self.log(f"🚀 Starting AI roadmap stability test with {num_generations} generations")
        
        results = {
            "total_attempts": num_generations,
            "successful_generations": 0,
            "failed_generations": 0,
            "generation_times": [],
            "errors": [],
            "assessments_tested": []
        }
        
        for i in range(num_generations):
            self.log(f"\n--- Generation Test {i+1}/{num_generations} ---")
            
            # Create new assessment for each test to avoid caching
            assessment_id = self.create_test_assessment()
            if not assessment_id:
                results["failed_generations"] += 1
                results["errors"].append(f"Generation {i+1}: Failed to create assessment")
                continue
            
            results["assessments_tested"].append(assessment_id)
            
            # Process payment
            if not self.process_mock_payment(assessment_id):
                results["failed_generations"] += 1
                results["errors"].append(f"Generation {i+1}: Failed to process payment")
                continue
            
            # Generate AI roadmap
            generation_result = self.generate_ai_roadmap(assessment_id, i+1)
            results["generation_times"].append(generation_result.get("generation_time", 0))
            
            if generation_result["success"]:
                results["successful_generations"] += 1
                
                # Verify persistence
                if self.verify_ai_persistence(assessment_id):
                    self.log(f"✅ Generation {i+1} complete and verified")
                else:
                    self.log(f"⚠️  Generation {i+1} succeeded but persistence verification failed", "WARNING")
            else:
                results["failed_generations"] += 1
                error_msg = f"Generation {i+1}: {generation_result.get('error', 'Unknown error')}"
                results["errors"].append(error_msg)
                
                # Check for 502 errors specifically
                if generation_result.get("status_code") == 502:
                    results["502_errors"] = results.get("502_errors", 0) + 1
            
            # Small delay between generations
            if i < num_generations - 1:
                time.sleep(2)
        
        return results
    
    def run_comprehensive_test(self):
        """Run comprehensive backend testing for AI roadmap stability"""
        self.log("=" * 60)
        self.log("SARATHI AI ROADMAP STABILITY TESTING")
        self.log("Testing stabilized Gemini integration after 502 fixes")
        self.log("=" * 60)
        
        # Test API health first
        if not self.test_api_health():
            self.log("❌ API health check failed - aborting tests", "ERROR")
            return False
        
        # Run stability test with multiple generations
        stability_results = self.run_stability_test(3)
        
        # Print comprehensive results
        self.log("\n" + "=" * 60)
        self.log("STABILITY TEST RESULTS")
        self.log("=" * 60)
        
        total = stability_results["total_attempts"]
        successful = stability_results["successful_generations"]
        failed = stability_results["failed_generations"]
        success_rate = (successful / total * 100) if total > 0 else 0
        
        self.log(f"Total Generations Attempted: {total}")
        self.log(f"Successful Generations: {successful}")
        self.log(f"Failed Generations: {failed}")
        self.log(f"Success Rate: {success_rate:.1f}%")
        
        if stability_results["generation_times"]:
            avg_time = sum(stability_results["generation_times"]) / len(stability_results["generation_times"])
            min_time = min(stability_results["generation_times"])
            max_time = max(stability_results["generation_times"])
            self.log(f"Average Generation Time: {avg_time:.1f}s")
            self.log(f"Min/Max Generation Time: {min_time:.1f}s / {max_time:.1f}s")
        
        # Check for 502 errors specifically
        if stability_results.get("502_errors", 0) > 0:
            self.log(f"⚠️  502 Errors Detected: {stability_results['502_errors']} (This was the issue being fixed!)", "WARNING")
        else:
            self.log("✅ No 502 errors detected - stability fix appears successful")
        
        if stability_results["errors"]:
            self.log("\nErrors encountered:")
            for error in stability_results["errors"]:
                self.log(f"  - {error}")
        
        # Overall assessment
        self.log("\n" + "=" * 60)
        if success_rate >= 100:
            self.log("✅ STABILITY TEST PASSED: All AI generations successful")
            self.log("✅ /api/generate-roadmap appears stable after 502 fixes")
        elif success_rate >= 66:
            self.log("⚠️  STABILITY TEST PARTIAL: Most generations successful but some issues remain")
        else:
            self.log("❌ STABILITY TEST FAILED: High failure rate indicates ongoing issues")
        
        return success_rate >= 66

def main():
    """Main test execution"""
    tester = SarathiBackendTester()
    
    try:
        success = tester.run_comprehensive_test()
        exit_code = 0 if success else 1
        
        print(f"\n{'='*60}")
        print(f"BACKEND TESTING COMPLETE - Exit Code: {exit_code}")
        print(f"{'='*60}")
        
        return exit_code
        
    except KeyboardInterrupt:
        print("\n❌ Testing interrupted by user")
        return 1
    except Exception as e:
        print(f"\n❌ Testing failed with error: {str(e)}")
        return 1

if __name__ == "__main__":
    exit(main())