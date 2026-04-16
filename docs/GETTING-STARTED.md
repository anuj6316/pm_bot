# Getting Started

Follow these steps to launch the PM Bot locally using Docker Compose and modern `uv` Python package management.

## Prerequisites
- Docker & Docker Compose
- `uv` Python package manager (optional for local host shell operations, strictly contained within the Docker environments though)

## Setup Instructions

### 1. Configure the Environment
Clone the repository and insert your specific environment variables over `.env`. A baseline is provided out of the box with standard local development credentials for Postgres/Redis.

```bash
cp .env.example .env
```
Ensure you embed the `PLANE_API_TOKEN` and `GROQ_API_KEY` to connect to external systems correctly (as mentioned in `docs/CONFIGURATION.md`).

### 2. Launch the Infrastructure
The application separates the backend logic across `web`, `worker`, and `beat`. The Docker compose structure orchestrates all routing automatically.

```bash
docker compose up --build -d
```
This single command spins up:
- `postgres-django` (Internal DB, port 5432)
- `redis` (Internal Broker, port 6379 natively mapped to 8005 safely)
- `django-web` (Admin Backend running on http://localhost:8002)
- `celery-worker` (Executes the LLM graph operations)
- `celery-beat` (Schedules polling triggers)

### 3. Verification
Run the following to assert the system components have come online and the database is structured:
```bash
docker compose exec django-web uv run python manage.py migrate
docker compose exec django-web uv run python manage.py createsuperuser
```

You can now log into the Django Admin at `http://localhost:8002/admin` to observe the `AgentIssueSession` states populating organically as issues flow in.
