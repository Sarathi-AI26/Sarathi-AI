#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================
user_problem_statement: "Build a full-stack career guidance SaaS application called SARATHI using Next.js App Router, Tailwind CSS, and Supabase with landing, assessment, checkout, and result dashboard."
backend:
  - task: "Supabase-backed assessment + payment gate API"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Implemented /api root, /api/assessment/questions, POST /api/assessments, GET /api/assessments/:id, POST /api/payments/mock, and GET /api/results/:id using Supabase service role. If the manual SQL schema has not been run yet, endpoints return a Supabase schema hint."
      - working: true
        agent: "testing"
        comment: "COMPREHENSIVE BACKEND TESTING COMPLETED: All core API functionality working correctly. Schema-independent endpoints (health, questions, validation, routing) all pass. Schema-dependent endpoints (assessments, payments, results) correctly detect missing Supabase schema and provide appropriate error responses. API is production-ready - only needs /app/supabase_schema.sql to be run in Supabase SQL Editor for full database functionality. Minor: withSchemaHint function could be enhanced to catch more schema error patterns like 'column does not exist'."
frontend:
  - task: "Landing page and assessment funnel UI"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Built SARATHI landing page plus responsive multi-step assessment form with progress bar and React Hook Form validation."
  - task: "Checkout and result dashboard UI"
    implemented: true
    working: "NA"
    file: "/app/components/result-dashboard.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Built MOCKED checkout experience and DUMMY AI result dashboard with gated access, readiness score, recommendations, and print-to-PDF action."
metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false
test_plan:
  current_focus:
    - "Frontend testing (if needed)"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"
agent_communication:
  - agent: "main"
    message: "Implemented SARATHI MVP. User did not provide DB password, so manual schema SQL was added at /app/supabase_schema.sql. Please backend-test API behavior with this constraint in mind and verify health/schema-hint behavior."
  - agent: "testing"
    message: "BACKEND TESTING COMPLETE ✅ All API endpoints working correctly. Core functionality (health, questions, validation, routing) fully operational. Schema-dependent endpoints properly handle missing database schema with appropriate error responses. API is production-ready and only needs Supabase schema application for full database features. Minor enhancement opportunity: improve withSchemaHint function to catch more schema error patterns."
