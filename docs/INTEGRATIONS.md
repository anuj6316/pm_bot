<!-- generated-by: gsd-doc-writer -->
## INTEGRATIONS.md

This document outlines the external services and APIs integrated with PM Bot.

### External APIs
- **Plane (Cloud):** The primary platform for project management.
  - Integration: `plane_client/client.py`
  - Authentication: `PLANE_API_TOKEN` (X-API-Key)

### LLM Integration
- **LiteLLM:** Used to manage multi-provider LLM support, enabling simple switching between Groq, OpenAI, and Anthropic.
  - Configuration: `LLM_MODEL` environment variable.

### Infrastructure
- **PostgreSQL (v16):** Main data storage with `pgvector` enabled for future AI similarity features.
- **Redis Stack:** Used as the message broker for Celery and state cache.
- **MLflow/Databricks:** Used for tracing agent reasoning and task execution telemetry.

### CLI Administration
The `pm-bot` CLI tool connects to the Django environment to provide management utilities:
- `pm-bot status`: Monitors active agent issue sessions.
- `pm-bot sync`: Manually dispatches a polling task to the Celery worker.
