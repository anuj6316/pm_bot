# Project Context: PM Bot

This project is a monorepo consisting of a Django backend, managed with `uv`.

## Tech Stack
- **Backend:** Django 6.0, Django REST Framework, Celery, LangChain/LangGraph.
- **Package Management:** `uv`.
- **Linting/Formatting:** `ruff`.
- **Integrations:** Plane (Project Management tool).

## Engineering Standards & Commands

### 1. Environment Management
- Use `uv` for all dependency management.
- Root contains `pyproject.toml` and `uv.lock`.

### 2. Testing
- **Backend (Django):** 
  - Local: `uv run backend/manage.py test`
  - Docker: `docker exec -it pm_bot-django-web-1 python manage.py test`

### 3. Linting & Formatting
- **Check:** `uv run ruff check .`
- **Fix:** `uv run ruff check --fix .`
- **Format:** `uv run ruff format .`

### 4. GSD Workflow Mandates
- **Validation:** Every implementation task must be followed by running the relevant tests and linter commands.
- **Surgical Edits:** Favor targeted changes in `backend/` over global refactors unless explicitly requested.
- **Documentation:** Maintain `PROJECT_SNAPSHOT.json` via the `project-snapshot-manager` skill for all code modifications.
