# External Integrations

**Analysis Date:** 2026-04-14

## APIs & External Services

**Project Management:**
- Plane (Self-hosted or Cloud) - Core integration for issue tracking and PM automation.
  - SDK/Client: Custom `PlaneClient` in `backend/plane_client/client.py`
  - Auth: `PLANE_API_TOKEN` environment variable used as `X-API-Key: plane_api_<token>`

**LLM Providers:**
- Multi-provider support via LiteLLM.
  - Integration: `litellm` package
  - Configuration: Key environment variables for specific providers (e.g., `OPENAI_API_KEY`)

## Data Storage

**Databases:**
- PostgreSQL (v16.1 suggested from `docker-compose.yml`)
  - Connection: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`
  - Client: Django ORM (`psycopg2`)
  - Extension: `pgvector` for AI-related vector search

**File Storage:**
- Local filesystem for `uploads/` (as per `docker-compose.yml` volumes)

**Caching / Broker:**
- Redis Stack - Used for Celery task queuing and results tracking.
  - Integration: `redis` service in `docker-compose.yml`

## Authentication & Identity

**Auth Provider:**
- Custom (Django Auth)
  - Implementation: `djangorestframework-simplejwt` used for API access.

## Monitoring & Observability

**Error Tracking:**
- Not explicitly configured yet in code, but Sentry is often paired with Django.

**Logs:**
- Standard Python logging with Django configuration.
- AI Trace: LangFuse integration (planned in `docs/llm_integration_plan.md`).

## CI/CD & Deployment

**Hosting:**
- Docker-orchestrated containers.

**CI Pipeline:**
- Not detected in the codebase structure (no `.github/workflows` seen in root yet).

## Environment Configuration

**Required env vars:**
- `PLANE_BASE_URL` - Base URL for the Plane instance
- `PLANE_API_TOKEN` - API token for authenticating with Plane
- `PLANE_WORKSPACE_SLUG` - The slug of the workspace to target
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` - Database credentials
- `REDIS_URL` (usually injected into Django/Celery settings)

**Secrets location:**
- `.env` files (managed locally, not committed)

## Webhooks & Callbacks

**Incoming:**
- Not yet implemented. Polling is current strategy in `docs/llm_integration_plan.md`.

**Outgoing:**
- Plane Comments: Bot posts responses as comments to issues using `PlaneClient`.

---

*Integration audit: 2026-04-14*
