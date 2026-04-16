<!-- generated-by: gsd-doc-writer -->
## README.md

An autonomous, production-grade AI agent that triages, responds to, and manages [Plane](https://app.plane.so) issues using a stateful **LangGraph** reasoning workflow, **Celery** background workers, and **MLflow/Databricks** observability.

### Installation
You will need `uv` installed.
```bash
git clone <repository-url>
cd pm-bot
uv sync
```

### Quick Start
1. Configure environment variables in a `.env` file (see Configuration section).
2. Start the infrastructure:
   ```bash
   docker-compose up -d
   ```
3. Run migrations and create a superuser:
   ```bash
   docker exec -it pm_bot-django-web-1 uv run python manage.py migrate
   docker exec -it pm_bot-django-web-1 uv run python manage.py createsuperuser
   ```

### CLI Usage
The project includes a CLI tool `pm-bot` for managing the agent from your terminal:
```bash
# View recent agent sessions
uv run pm-bot status

# Manually trigger a poll of Plane issues
uv run pm-bot sync
```

### Usage Examples
* **Autonomous Triaging:** The bot polls Plane every 5 minutes and uses its LangGraph brain to triage and draft comments.
* **Human-in-the-Loop:** Approve agent-generated drafts via the Django Admin panel at `http://localhost:8002/admin`.

See CONTRIBUTING.md for guidelines.

License: MIT (See LICENSE file)
