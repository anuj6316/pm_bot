# Phase 12 Research: CLI Interface

## Executive Summary
This research defines the implementation strategy for a standalone CLI tool (`pm-bot`) that interfaces with the Django backend. It prioritizes developer experience, rich terminal output, and seamless integration with the existing Django ORM and Celery tasks.

## Standard Stack
- **CLI Framework:** [Typer](https://typer.tiangolo.com/) (modern, type-hint based, built on Click).
- **Terminal UI:** [Rich](https://github.com/Textualize/rich) (for tables, progress bars, and markdown rendering).
- **Environment Management:** `python-dotenv` (to load `.env` variables).
- **Django Integration:** `django.setup()` for ORM access within standalone scripts.

## Architecture Patterns

### 1. The "Django-First" CLI
To access models (`AgentIssueSession`) and settings, the CLI must initialize Django:
```python
import os
import django

def init_django():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.backend.settings")
    django.setup()
```

### 2. Standalone vs. `manage.py` Command
- **Decision:** A standalone CLI (using `pm-bot` entry point in `pyproject.toml`) is preferred over `python manage.py ...` for better distribution and a cleaner user interface.
- **Implementation:** Use `uv` or `pip` to install the package in editable mode.

## Don't Hand-Roll
- **Table Formatting:** Use `rich.table.Table`.
- **Progress Bars:** Use `rich.progress.Progress`.
- **Colored Logs:** Use `rich.logging.RichHandler`.

## Common Pitfalls
- **Path Issues:** Ensure `sys.path` includes the `backend/` directory so Django can find the settings.
- **Async Collisions:** If using `SSE` client in the CLI, ensure compatibility between Typer (synchronous by default) and `httpx` or `aiohttp` for async streaming.
- **Database Locks:** Avoid long-running CLI transactions that might block Celery workers.

## Code Examples

### 1. Base Typer App with Django Init
```python
import typer
from rich.console import Console

app = typer.Typer()
console = Console()

@app.callback()
def callback():
    """PM Bot CLI - Manage your autonomous PM."""
    init_django()

@app.command()
def status():
    """View status of all active sessions."""
    from deep_agent.models import AgentIssueSession
    # ... logic to render Rich table ...
```

### 2. Triggering Celery Tasks
```python
@app.command()
def sync():
    """Trigger a manual poll of Plane issues."""
    from plane_client.tasks import poll_plane_issues
    poll_plane_issues.delay()
    console.print("[green]Sync task dispatched to Celery worker.[/green]")
```

## Confidence Assessment
- **Typer/Rich Integration:** 100% (Industry standard).
- **Django Standalone Init:** 95% (Path management is the only slight hurdle).
- **Celery Integration:** 100% (Standard `.delay()` pattern).
