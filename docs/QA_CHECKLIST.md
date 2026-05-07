# PM Bot QA Checklist

This document contains a comprehensive, 100-question checklist for verifying the complete functionality, security, and performance of the PM Bot platform.

## Categories

### 1. Setup, Deployment & Configuration (Docker, Env)

- [ ] Is the `.env` file correctly loaded with all required environment variables (e.g., `PLANE_API_TOKEN`, `GROQ_API_KEY`)?
- [ ] Do all Docker containers (`postgres-django`, `redis`, `django-web`, `ui`, `celery-worker`, `celery-beat`) start successfully without errors?
- [ ] Are the exposed ports functioning correctly (e.g., 5432 for Postgres, 8002 for Django, 5173 for Vite UI)?
- [ ] Can you access the Django admin interface at `http://localhost:8002/admin`?
- [ ] Can you access the React frontend UI at `http://localhost:5173`?
- [ ] Does the `uv` package manager install Python dependencies without conflicts?
- [ ] Do database migrations run cleanly on fresh setup (`python manage.py migrate`)?
- [ ] Does the command `python manage.py createsuperuser` successfully create an admin account?
- [ ] Is the CORS configuration allowing requests from the frontend UI to the Django backend?
- [ ] Is the WebSocket routing properly configured in Django Channels for live updates?

### 2. Authentication & Access Control

- [ ] Can an admin user log in to the Django Admin portal with correct credentials?
- [ ] Are invalid login attempts to Django Admin properly rejected with an error message?
- [ ] Are non-admin users blocked from accessing the Django Admin interface?
- [ ] Is the Django REST API properly protecting endpoints that require authentication?
- [ ] Are JWT tokens (if used) correctly issued and validated upon API requests?
- [ ] Does the system lock accounts after repeated failed login attempts?
- [ ] Are session tokens expiring correctly according to the configured timeout?
- [ ] Can you successfully log out and invalidate the session?
- [ ] Is role-based access control preventing regular users from approving bot drafts?
- [ ] Are sensitive environment variables (API keys) hidden from the UI and non-admin API responses?

### 3. UI/UX & WebSockets (React Frontend)

- [ ] Does the React application load without any console errors?
- [ ] Is the chat interface responsive on different screen sizes (desktop, tablet, mobile)?
- [ ] Does the UI correctly establish a WebSocket connection with the backend upon loading?
- [ ] Do WebSocket disconnections automatically attempt to reconnect?
- [ ] Are new incoming messages displayed in the chat UI in real-time without refreshing?
- [ ] Can the user submit a prompt through the chat input field?
- [ ] Is there a visual loading indicator when the agent is processing a request?
- [ ] Are Markdown-formatted responses from the agent rendered correctly in the UI?
- [ ] Do error states (e.g., network failure) show user-friendly error messages?
- [ ] Is the chat history accurately fetched and displayed when reloading the page?

### 4. Agent & LangGraph Reasoning

- [ ] Does the LangGraph workflow successfully initialize when processing an issue?
- [ ] Does the agent correctly classify a bug ticket as 'BUG' based on the issue description?
- [ ] Does the agent correctly classify a feature request ticket as 'FEATURE'?
- [ ] Does the agent correctly classify a general question as 'QUESTION'?
- [ ] Is the context window properly assembling relevant data before passing it to the LLM?
- [ ] Does the LiteLLM proxy successfully route requests to the underlying model (e.g., Groq)?
- [ ] Are prompt templates correctly filled with Plane issue details?
- [ ] Does the agent fallback gracefully if the LLM provider times out or returns an error?
- [ ] Are hallucinated or off-topic responses prevented or minimized by system prompts?
- [ ] Does the LangGraph state correctly transition between nodes (e.g., triage -> draft response)?

### 5. Plane.so Integrations

- [ ] Does the Celery Beat scheduler poll Plane exactly every 5 minutes as configured?
- [ ] Can the system successfully fetch new, unassigned issues from the Plane API?
- [ ] Does the system correctly ignore issues that have already been processed?
- [ ] Are Plane issue details (title, description, state, priority) parsed correctly?
- [ ] Can the `PlaneClient` successfully post a drafted comment back to the original Plane issue?
- [ ] Does the system handle Plane API rate limits correctly (e.g., retries/backoff)?
- [ ] Does the system handle invalid `PLANE_API_TOKEN` gracefully without crashing?
- [ ] Can the `pm-bot sync` CLI command manually trigger a successful Plane sync?
- [ ] Are updates to Plane issues reflected in the bot's internal state if queried again?
- [ ] Does the system log network failures when Plane.so is temporarily unreachable?

### 6. Human-in-the-Loop (Django Admin)

- [ ] Are new agent sessions accurately recorded in the `AgentIssueSession` model?
- [ ] Do drafted LLM responses appear in the Django Admin waiting for approval?
- [ ] Does the Django Admin display the original Plane issue context alongside the draft?
- [ ] Can an admin manually edit the drafted response before approving it?
- [ ] Does clicking 'Approve' successfully transition the draft state to 'Approved'?
- [ ] Does approving a draft immediately trigger the Celery task to post to Plane?
- [ ] Can an admin reject a draft, and does it correctly halt the posting process?
- [ ] Are the status indicators (e.g., Pending, Approved, Posted) updating correctly in the admin view?
- [ ] Is the history of state changes for an `AgentIssueSession` preserved and viewable?
- [ ] Are multiple pending drafts easily filterable or searchable within the Django Admin?

### 7. Database, Redis & Background Tasks

- [ ] Is Postgres successfully storing and retrieving complex JSONB fields used by LangGraph state?
- [ ] Are pgvector extensions correctly enabled and functioning for vector storage (if applicable)?
- [ ] Is Redis correctly acting as the message broker for Celery tasks?
- [ ] Do Celery workers correctly pick up and execute background tasks from the queue?
- [ ] Are failed Celery tasks retried according to configured retry policies?
- [ ] Does Celery Beat correctly register and trigger periodic tasks on startup?
- [ ] Is database connection pooling functioning efficiently under multiple concurrent requests?
- [ ] Are database transactions rolling back correctly if a critical operation fails midway?
- [ ] Is Redis caching functioning correctly for frequently accessed but rarely changed data?
- [ ] Do long-running LLM tasks avoid blocking other background tasks in the queue?

### 8. CLI Tools (`pm-bot`)

- [ ] Does `uv run pm-bot status` return the correct operational status of the agent?
- [ ] Does `uv run pm-bot status` list recent agent sessions accurately?
- [ ] Does the CLI correctly display error messages if services are down?
- [ ] Does the `pm-bot sync` command output logs detailing the sync process?
- [ ] Can you pass arguments to the CLI to filter output (if applicable)?
- [ ] Is the CLI help command (`--help`) informative and accurate?
- [ ] Does running CLI commands require appropriate local environment variables?
- [ ] Does the CLI handle interruptions (Ctrl+C) cleanly without leaving hanging connections?
- [ ] Are CLI outputs formatted readably (e.g., tables, color-coded statuses)?
- [ ] Does the CLI correctly report the count of newly fetched issues during a sync?

### 9. Security & Data Isolation

- [ ] Are user sessions strictly isolated so one user cannot see another's chat history?
- [ ] Is the Django backend sanitizing inputs to prevent SQL Injection?
- [ ] Are React UI inputs sanitized to prevent Cross-Site Scripting (XSS)?
- [ ] Does the LLM system prompt prevent prompt injection attacks or attempts to dump system instructions?
- [ ] Are user passwords securely hashed in the database?
- [ ] Are WebSockets secured to prevent unauthorized connection hijacking?
- [ ] Does the system prevent unauthorized file or directory path traversal?
- [ ] Are detailed stack traces hidden from users in production error responses?
- [ ] Are sensitive fields (like tokens) excluded from Django Admin logs and audit trails?
- [ ] Is Cross-Site Request Forgery (CSRF) protection enabled and functioning for API calls?

### 10. Performance, Logging & Edge Cases

- [ ] Does the system remain stable and responsive when polling 100+ issues at once?
- [ ] Do logging configurations correctly capture errors, warnings, and info logs?
- [ ] Are LangGraph trace logs clearly indicating decision paths for debugging?
- [ ] Does the UI handle very long responses from the LLM without freezing?
- [ ] What happens if the database runs out of disk space (is it logged gracefully)?
- [ ] Does the system recover automatically after a Redis crash and restart?
- [ ] Are timeout limits enforced on LLM API calls to prevent indefinite hanging?
- [ ] Can the system correctly parse and handle Plane issues with complex markdown or images?
- [ ] Is the Docker image size optimized for production deployment?
- [ ] Are all Python tests passing cleanly (`pytest`) with no silent failures?
