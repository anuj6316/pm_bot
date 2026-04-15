# Technology Stack

**Analysis Date:** 2026-04-14

## Languages

**Primary:**
- Python 3.14+ - Core backend language used in `backend/` and `main.py`

**Secondary:**
- Shell Script - Used for database initialization in `postgres-init/init-db.sh` and helper scripts like `backend/test.sh`

## Runtime

**Environment:**
- Docker - Full environment orchestration using `docker-compose.yml`
- Python Runtime - Managed via `.python-version`

**Package Manager:**
- `uv` - Primary package manager for the monorepo
- Lockfile: `uv.lock` present

## Frameworks

**Core:**
- Django 6.0.4 - Primary web framework (`backend/`)
- Django REST Framework 3.17.1 - API development (`backend/`)

**AI/LLM:**
- LangChain 1.2.15 - LLM orchestration
- LangGraph 1.1.6 - Stateful multi-agent workflows
- LiteLLM 1.83.4 - Unified LLM interface
- smolagents 1.24.0 - Lightweight agent tools

**Testing:**
- Django Test Framework - Standard unit and integration testing (`backend/plane_client/tests.py`)

**Build/Dev:**
- `ruff` - Linting and formatting
- `docker-compose` - Local development environment orchestration

## Key Dependencies

**Critical:**
- `requests` - Used for external API calls to Plane in `backend/plane_client/client.py`
- `python-dotenv` - Environment variable management
- `djangorestframework-simplejwt` - JWT authentication for APIs

**Infrastructure:**
- `psycopg2-binary` (implied by PostgreSQL) - Database driver
- `celery` - Distributed task queue for asynchronous LLM processing
- `django-celery-results` - Backend for storing Celery task results
- `redis` - Message broker for Celery

## Configuration

**Environment:**
- Managed via `.env` files (not committed) and `python-dotenv`
- Docker-compose handles networking and environment injection for containers

**Build:**
- `pyproject.toml` - Main dependency configuration
- `backend/Dockerfile` - Backend container definition
- `docker-compose.yml` - Multi-service orchestration

## Platform Requirements

**Development:**
- Docker and Docker Compose
- `uv` package manager

**Production:**
- Deployment target: Container-orchestrated environment (e.g., Kubernetes, AWS ECS) with PostgreSQL and Redis.

---

*Stack analysis: 2026-04-14*
