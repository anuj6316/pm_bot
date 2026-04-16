# Configuration Guide

PM Bot relies on `.env` configuration to control container behavior, toggle debugging interfaces, and securely bind to external APIs (Plane.so, Databricks, Groq).

## Environment Variables

The project utilizes a root-level `.env` file that is synced uniformly into the `django-web`, `celery-worker`, and `celery-beat` containers via docker-compose configuration.

### Core Database (PostgreSQL)
- `POSTGRES_DB`: Name of the database (default: `pm_bot`).
- `POSTGRES_USER`: Database authenticated user (default: `pm_bot`).
- `POSTGRES_PASSWORD`: Database password (Required).

### Django Framework Core
- `DJANGO_SECRET_KEY`: Standard Django cryptographic key.
- `DJANGO_DEBUG`: Toggles Verbose mode locally. Do not use `True` in production.
- `REDIS_URL` / `CELERY_BROKER_URL_DJANGO`: Internal pointers to the Redis container mapping (`redis://redis:6379/X`).

### Plane.so Integrations
- `PLANE_BASE_URL`: Defines whether connecting to self-hosted or cloud planes (e.g., `https://api.plane.so`).
- `PLANE_API_TOKEN`: The bearer token provided by your Plane.so settings dashboard.
- `PLANE_WORKSPACE_SLUG`: The domain slug housing your projects.

### LLM Configurations
- `GROQ_API_KEY`: Fast OSS inference. 
- `LLM_MODEL`: Defines the LiteLLM execution target. Current implementations assume `groq/openai/gpt-oss-120b` formatting. `[[VERIFY: Ensure valid routing format upstream]]`

### Databricks MLFlow Analytics
- `DATABRICKS_HOST`: Your Databricks Cloud Workspace instance URL.
- `DATABRICKS_TOKEN`: Your Personal Access Token for securely connecting the tracer.
- `MLFLOW_TRACKING_URI`: Defines the tracking server backend (Must be `databricks` for Cloud Tracking).
- `MLFLOW_EXPERIMENT_NAME`: The absolute path in Databricks matching the `/Shared/pm_bot_traces` destination.

---

## Modifying Configurations in Production
Modifications to the `.env` file necessitate rebuilding or safely restarting the Celery pipelines. Ensure `docker compose down` followed by `docker compose up -d` handles the environment repopulation safely.
