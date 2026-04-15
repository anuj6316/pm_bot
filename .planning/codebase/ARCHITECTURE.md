# Architecture

**Analysis Date:** 2026-04-14

## Pattern Overview

**Overall:** Django Monolith with Asynchronous AI Worker Pattern.

**Key Characteristics:**
- **Stateful AI Agents:** AI logic is decoupled from the web request cycle via Celery and state models (`AgentIssueSession` - planned).
- **External Integration Encapsulation:** All Plane API logic is isolated in a dedicated app and client class.
- **Workflow-as-Graph:** AI reasoning steps are managed via LangGraph for modularity and recovery.

## Layers

**API & Web Layer:**
- Purpose: Provides the core web server and REST endpoints.
- Location: `backend/`
- Contains: Django settings, root URLs, and application registry.
- Depends on: `deep_agent`, `plane_client`
- Used by: Users and future frontend services.

**Service Integration Layer:**
- Purpose: Handles all communication with the Plane PM tool.
- Location: `backend/plane_client/`
- Contains: `PlaneClient` for CRUD operations, custom exceptions, and model definitions (planned).
- Depends on: `requests`, `python-dotenv`
- Used by: `deep_agent` and Celery tasks.

**AI Agent Layer:**
- Purpose: Core intelligence, workflow management, and state tracking.
- Location: `backend/deep_agent/`
- Contains: AI logic, LangGraph workflows, and session models.
- Depends on: `plane_client`, `langchain`, `langgraph`, `litellm`
- Used by: Celery workers.

**Asynchronous Worker Layer:**
- Purpose: Executes long-running tasks like LLM processing and polling.
- Location: Integrated within Django via `celery`.
- Contains: `backend/backend/celery.py` and task definitions in individual apps.
- Depends on: Redis, PostgreSQL.

## Data Flow

**AI Processing Flow (Planned):**

1.  **Poll:** Celery task polls Plane for new/unprocessed issues using `PlaneClient`.
2.  **Initialize:** Create an `AgentIssueSession` model record to track progress and state.
3.  **Acknowledge:** Post a "Thinking..." comment to the Plane issue via `PlaneClient`.
4.  **Process:** Execute the LangGraph workflow (`analyze` -> `search` -> `generate` -> `review`).
5.  **Respond:** Post the final result back to Plane and update the session status to `COMPLETED`.

**State Management:**
- Primary state resides in PostgreSQL (Django ORM).
- `AgentIssueSession` acts as the source of truth for the AI's current progress on any given issue.

## Key Abstractions

**`PlaneClient`:**
- Purpose: Centralizes API logic for Plane, providing a clean Pythonic interface.
- Examples: `backend/plane_client/client.py`
- Pattern: Service Client / Adapter.

**`AgentIssueSession` (Planned):**
- Purpose: Represents a single unit of work for the AI agent.
- Examples: `backend/deep_agent/models.py`
- Pattern: State Machine / Unit of Work.

## Entry Points

**Django Management Commands:**
- Location: `backend/manage.py`
- Triggers: CLI commands for running the server, migrations, and tests.

**Celery Worker:**
- Location: `backend/backend/celery.py`
- Triggers: Background tasks queued by the application or periodic tasks.

## Error Handling

**Strategy:** Centralized exception handling in the integration layer with retries in the worker layer.

**Patterns:**
- **Custom Exceptions:** `PlaneAuthError`, `PlaneNotFoundError`, etc., in `backend/plane_client/exceptions.py`.
- **Defensive API Parsing:** Safe handling of `204 No Content` and malformed JSON in `PlaneClient._request()`.
- **Task Retries (Planned):** Celery tasks will use exponential backoff for transient LLM or API errors.

## Cross-Cutting Concerns

**Logging:** Standard Python `logging` used within Django.
**Validation:** API payload validation via `PlaneClient` and DRF (future).
**Authentication:** JWT for system-to-system or user-to-system access (via `simplejwt`).

---

*Architecture analysis: 2026-04-14*
