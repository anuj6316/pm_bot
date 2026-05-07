# PM Bot: Comprehensive Testing Guide

This document outlines the testing strategies, scenarios, and edge cases for both the Frontend UI/UX and the Backend systems of the PM Bot platform.

---

## Part 1: UI/UX Level (React / Vite Frontend)

The React frontend (located in `ui/`) interacts with the Django backend via REST APIs and WebSockets. Testing here ensures robust state management, smooth user experiences, and proper error handling.

### 1. Authentication & State
* **Valid Login:** User logs in with valid credentials. Verify a JWT token is stored, and the user is redirected to the Dashboard.
* **Invalid Login:** User enters incorrect credentials. Verify a user-friendly error message is displayed (e.g., "Invalid credentials").
* **Token Expiration & Refresh:** If the access token expires, verify the UI gracefully handles 401 errors, ideally attempting a background refresh. If refresh fails, verify the user is logged out and redirected to the login screen.
* **Persistent Sessions:** Verify that reloading the page (F5) maintains the authenticated state and doesn't log the user out.

### 2. Dashboard & Navigation
* **Data Fetching:** Verify the Dashboard correctly fetches and renders project statistics and recent activity.
* **Sidebar Navigation:** Ensure clicking navigation links (Dashboard, Chat, Issues, Users, Settings) updates the active view quickly and reflects the current route.
* **Responsive Layout:** Shrink the browser window to mobile dimensions. Verify the sidebar collapses into a hamburger menu and that main content areas remain legible.

### 3. Chat Interface & WebSockets
* **WebSocket Connection:** Navigate to the Chat view. Verify the WebSocket connection (`wss://...`) establishes successfully.
* **Message Sending:** Send a message. Verify it appears instantly in the chat window.
* **Streaming Responses:** When the agent replies, verify the message chunks render progressively in real-time.
* **Reconnection Logic:** Disconnect the network temporarily. Verify the UI shows a "Disconnected" or "Reconnecting..." state, and re-establishes the connection when the network returns.
* **Agent State Badges:** Verify visual indicators update when the agent transitions through reasoning states (e.g., "Thinking...", "Analyzing", "Drafting").

### 4. Issues & Data Grids
* **Data Rendering:** Ensure the issues grid populates correctly from the API.
* **Filtering & Sorting:** Apply filters (e.g., status, priority) and sorting. Verify the grid updates accurately based on backend responses.
* **Empty States:** When a project has no issues, ensure a clear, user-friendly empty state is displayed rather than a blank table.

### 5. Settings & Profile
* **API Key Management:** Navigate to Profile/Settings. Add a new API key. Verify it is saved securely and masked in the UI.
* **Form Validation:** Submit a form with missing required fields. Verify clear, inline validation errors appear before API submission.

---

## Part 2: Backend Level (Django / LangGraph / Celery)

The backend must be resilient to external API failures, manage asynchronous tasks flawlessly, and secure user data.

### 1. API Endpoints & Authentication
* **Endpoint Protection:** Verify that requests to protected endpoints without a valid JWT token return `401 Unauthorized`.
* **CORS Policies:** Verify CORS headers correctly block requests from unauthorized domains, while allowing requests from the specified frontend origins.
* **Session Management API:** Verify the session creation, listing, and deletion endpoints function as expected and are scoped strictly to the authenticated user.

### 2. Plane.so API Integration (`PlaneClient`)
* **Network Timeouts:** Simulate a timeout when polling Plane. Verify the `PlaneClient` raises a custom exception (e.g., `PlaneNetworkError`) and that the Celery task handles it without crashing the worker.
* **Malformed JSON Responses:** Simulate Plane returning HTML or broken JSON (e.g., `502 Bad Gateway`). Verify the client handles the parsing error gracefully.
* **Rate Limiting (429):** Simulate hitting a rate limit. Verify the client correctly backs off or raises an exception that triggers a Celery task retry.

### 3. Agentic Pipeline (LangGraph & Celery)
* **Celery Poller:** Verify the periodic Celery Beat task correctly triggers, identifies new "Unprocessed" issues, and dispatches processing tasks without duplicating efforts.
* **LangGraph Brain Execution:** Submit an issue with a clear bug description. Verify the LangGraph correctly transitions through `analyze` -> `triage` -> `generate` and updates the database state (`AgentIssueSession`).
* **LLM Provider Failure:** Simulate an error from the LLM provider (e.g., Groq API down). Verify the LangGraph node fails gracefully, the state transitions to an error state, and the error is logged.
* **Context Isolation:** When multiple users or projects are querying the agent simultaneously, verify that chat history and retrieved context strictly belong to the correct session and project.

### 4. Human-in-the-Loop (HITL) Workflow
* **Draft Generation:** Verify that when the agent finishes processing, a draft comment is stored but *not* immediately sent to Plane.
* **Approval Trigger:** Approve a draft via the Django Admin. Verify this fires the `process_approved_session` Celery task.
* **Finalization:** Verify the approved comment is successfully pushed back to the specific Plane issue, and the issue's local status is marked as "Completed".

### 5. Database State Integrity
* **Concurrent Modifications:** Attempt to approve a session draft simultaneously from two different clients. Verify the database locks or versioning prevent double-posting to Plane.
* **Data Migrations:** Run migrations on a populated database. Verify no data loss occurs when schema changes are applied.
