# Codebase Structure

**Analysis Date:** 2026-04-14

## Directory Layout

```
pm_bot/
├── backend/            # Django backend application root
│   ├── backend/        # Core Django settings, URLs, Celery, WSGI/ASGI
│   ├── deep_agent/     # AI agent core logic, models, and workflows
│   ├── plane_client/   # Service layer for Plane API integration
│   ├── manage.py       # Django CLI entry point
│   └── test.sh         # Helper script for running backend tests
├── docs/               # Technical documentation and status reports
├── postgres-init/      # Database initialization scripts
├── references/         # Project metadata and architectural snapshots
├── uploads/            # Local storage for file uploads (Docker volume)
├── docker-compose.yml  # Container orchestration
├── pyproject.toml      # Dependency management (uv)
└── uv.lock             # Deterministic dependency lockfile
```

## Directory Purposes

**`backend/`:**
- Purpose: Primary application source code.
- Contains: Django project and applications.
- Key files: `manage.py`, `backend/settings.py`

**`backend/plane_client/`:**
- Purpose: Isolated application for interacting with the Plane API.
- Contains: API client logic, exceptions, and integration tests.
- Key files: `client.py`, `exceptions.py`, `tests.py`

**`backend/deep_agent/`:**
- Purpose: The "brain" of the bot, containing AI orchestration and state tracking.
- Contains: LangGraph workflows, AI models, and processing tasks.
- Key files: `models.py` (state tracking), `tasks.py` (AI processing - planned)

**`docs/`:**
- Purpose: Project documentation for maintainability.
- Contains: Roadmap, status updates, and integration plans.
- Key files: `STATUS.md`, `llm_integration_plan.md`

## Key File Locations

**Entry Points:**
- `backend/manage.py`: Django development and management CLI.
- `backend/backend/wsgi.py` / `asgi.py`: Production web server entry points.
- `backend/backend/celery.py`: Asynchronous task worker entry point.

**Configuration:**
- `backend/backend/settings.py`: Main Django configuration.
- `pyproject.toml`: Dependency and build configuration.
- `docker-compose.yml`: Multi-service infrastructure configuration.

**Core Logic:**
- `backend/plane_client/client.py`: Plane API communication wrapper.
- `backend/deep_agent/`: AI workflow logic (LangGraph nodes and graphs).

**Testing:**
- `backend/plane_client/tests.py`: Integration and unit tests for the Plane client.

## Naming Conventions

**Files:**
- Snake Case: `client.py`, `models.py`, `test.sh`

**Directories:**
- Snake Case: `deep_agent/`, `plane_client/`, `postgres-init/`

## Where to Add New Code

**New AI Feature:**
- Primary logic: `backend/deep_agent/` (add new nodes/graphs/tasks).
- State models: `backend/deep_agent/models.py`.

**New External API Endpoint:**
- Implementation: Add to `PlaneClient` in `backend/plane_client/client.py`.
- Tests: Add to `backend/plane_client/tests.py`.

**New Database Migration:**
- Run: `uv run backend/manage.py makemigrations` (generates files in `migrations/` within the relevant app).

## Special Directories

**`.planning/codebase/`:**
- Purpose: Contains architectural maps and documentation for AI-assisted development.
- Generated: Yes (by GSD-Mapper)
- Committed: Yes

**`.venv/`:**
- Purpose: Local Python virtual environment.
- Generated: Yes (via `uv`)
- Committed: No

---

*Structure analysis: 2026-04-14*
