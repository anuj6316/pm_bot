# Development Guidelines

This document outlines the conventions and patterns needed to develop within the PM Bot monorepo smoothly.

## Dependency Management via `uv`

The backend utilizes `uv` as the lightning-fast Python package resolver. This has completely replaced standard `pip` formatting.
If you need to add dependencies, execute them securely against the `django-web` container using Docker:

```bash
docker compose exec django-web uv add <package_name>
```

Always remember to rebuild the celery workers if you add backend imports:
```bash
docker compose restart celery-worker celery-beat
```

## Adding to the AI Workflow
The core reasoning loop is securely stored inside `backend/deep_agent/brain/`. The primary logic execution paths rely on LangGraph:
- `graph.py` maps out the flow control.
- `nodes.py` handles the API calls bridging LiteLLM logic with payload formulation.
- `prompts.py` abstracts the actual text templates the LLMs observe.

When extending capabilities inside the `brain/`:
1. Use the `@mlflow.trace` wrappers exclusively for tracing the outer limits.
2. Rely absolutely on `LiteLLM` abstractions so that different providers can be securely hot-swapped over `LLM_MODEL` inside `.env` without triggering breaking syntax errors.

## Code Standards
We mandate formatting standardization across the python workspace:
```bash
# Check format errors:
docker compose exec django-web uv run ruff check .

# Fix auto-repairable issues:
docker compose exec django-web uv run ruff check --fix .
```

## Creating new Integrations (Future Phases)
To extend features outside of `plane.so`, refer to the abstraction provided inside `backend/plane_client`. The `client.py` and `exceptions.py` layout serves as the strict architectural blueprint for introducing JIRA, Linear, etc., down the line securely.
