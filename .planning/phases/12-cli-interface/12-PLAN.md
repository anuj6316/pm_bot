# Phase 12: CLI Interface Implementation Plan

## Goal
Implement a standalone CLI tool (`pm-bot`) to manage and monitor the PM Bot backend, providing real-time status updates and manual control over polling tasks.

## Dependencies
- Phase 04: Feedback Loop (State management must be stable)
- Backend must be reachable (Redis/Postgres running)

## Requirements
- REQ-009.1: Implement core CLI structure with Typer and Rich.
- REQ-009.2: Implement Django ORM integration for CLI commands.
- REQ-009.3: Add `status` command to view active sessions in a Rich table.
- REQ-009.4: Add `sync` command to manually trigger Celery polling tasks.
- REQ-009.5: Add `logs` command to stream agent reasoning progress via SSE.

## Tasks

### 1. Setup & Environment
- [ ] Install dependencies: `uv add typer rich httpx`.
- [ ] Create `cli/` directory with `__init__.py` and `main.py`.
- [ ] Add `pm-bot = "cli.main:app"` to `[project.scripts]` in root `pyproject.toml`.
- [ ] Implement `init_django()` helper to bootstrap the Django environment.

### 2. Core Commands
- [ ] Implement `status` command:
    - Query `AgentIssueSession` for recent/active sessions.
    - Render a `rich.table.Table` with ID, Issue, Status, and Updated time.
- [ ] Implement `sync` command:
    - Import `poll_plane_issues` task.
    - Dispatch with `.delay()`.
- [ ] Implement `logs` command:
    - Take `session_id` as argument.
    - Use `httpx` to connect to the SSE endpoint (Phase 04).
    - Stream and render output to the console.

### 3. Verification & Polishing
- [ ] Test CLI entry point using `uv run pm-bot --help`.
- [ ] Verify database connectivity from the CLI.
- [ ] Add coloring and icons (Lucide/Emoji) to enhance the UI.

## Verification Strategy
- **Manual:** Run `pm-bot status` and compare with Django Admin.
- **Integration:** Run `pm-bot sync` and monitor Celery logs for task execution.
- **Streaming:** Run `pm-bot logs <id>` during an active session to verify SSE output.
