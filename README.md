# PM Bot

A project management bot powered by AI agents, built with Django, LangChain, and LangGraph.

## Overview

PM Bot is an AI-powered project management assistant that leverages large language models (LLMs) to help with project management tasks. The system consists of multiple services including a Django backend, agent services, PostgreSQL with pgvector for vector storage, Qdrant for semantic search, Redis for caching, and Plane.so for project management UI.

## Architecture

The project uses a microservices architecture with the following components:

- **Django Backend** (`backend/`): Main API server built with Django and Django REST Framework
- **Agent Services** (`agent_services/`): AI agent services using LangChain and LangGraph
- **PostgreSQL**: Database with pgvector extension for vector embeddings
- **Qdrant**: Vector database for semantic search
- **Redis**: Caching and message broker
- **Plane.so**: Open-source project management tool

## Tech Stack

- **Backend**: Django 6+, Django REST Framework, JWT authentication
- **AI/ML**: LangChain, LangGraph, LiteLLM, Langfuse (for observability)
- **Database**: PostgreSQL with pgvector
- **Vector Store**: Qdrant
- **Cache/Broker**: Redis
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker and Docker Compose
- Python 3.12+
- uv (Python package manager)

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd pm-bot
```

### 2. Configure environment variables

Create a `.env` file in the root directory with the following variables:

```env
# PostgreSQL
POSTGRES_DB=pm_bot_db
POSTGRES_USER=pm_bot_user
POSTGRES_PASSWORD=your_secure_password

# Qdrant
QDRANT_API_KEY=your_qdrant_api_key

# Plane.so
PLANE_SECRET_KEY=your_plane_secret_key
PLANE_WEB_URL=http://localhost:8002
PLANE_ENABLE_EMAIL_PASSWORD_LOGIN=true
PLANE_ENABLE_SIGNUP=true

# Storage (optional - for S3)
STORAGE_TYPE=s3
USE_S3=false
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name
```

### 3. Start all services

```bash
docker-compose up -d
```

This will start the following services:
- PostgreSQL (port 5432)
- Adminer (port 8080) - Database admin UI
- Qdrant (port 6333)
- Django Backend (port 8000)
- Agent Services (port 8001)
- Redis (port 6379)
- Plane.so (port 8002)

### 4. Access the services

- **Django API**: http://localhost:8000
- **Agent Services Health Check**: http://localhost:8001/health
- **Adminer (Database UI)**: http://localhost:8080
- **Plane.so**: http://localhost:8002
- **Qdrant Dashboard**: http://localhost:6333/dashboard

## Development

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Agent Services Setup

```bash
cd agent_services
pip install -r requirements.txt
python main.py
```

### Using uv

```bash
uv sync
uv run python main.py
```

## Project Structure

```
pm-bot/
├── backend/                 # Django backend application
│   ├── backend/            # Django project settings
│   ├── deep_agent/         # Deep agent module
│   ├── manage.py           # Django management script
│   └── requirements.txt    # Backend dependencies
├── agent_services/         # AI agent services
│   ├── Dockerfile          # Agent services Docker config
│   ├── main.py             # Agent services entry point
│   └── requirements.txt    # Agent dependencies
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Root Dockerfile
├── pyproject.toml          # Python project configuration
├── requirements.txt        # Root dependencies
├── main.py                 # Main entry point
└── README.md               # This file
```

## Services Description

### Django Backend
- RESTful API built with Django REST Framework
- JWT authentication support
- CORS enabled for cross-origin requests
- Runs on port 8000

### Agent Services
- AI-powered agent using LangChain and LangGraph
- Health check endpoint at `/health`
- Supports multiple LLM providers via LiteLLM
- Observability with Langfuse
- Runs on port 8001

### Plane.so Integration
- Full-featured project management UI
- Integrated with PostgreSQL and Redis
- Accessible via proxy on port 8002

## Configuration

### Docker Compose Networks

All services communicate through the `pm_bot_network` bridge network.

### Volumes

- `pg_data`: PostgreSQL data persistence
- `qdrant_data`: Qdrant data persistence
- `redis_data`: Redis data persistence
- `./uploads`: Shared volume for Plane.so media files

## Health Checks

- **PostgreSQL**: Automatic health check every 5s
- **Agent Services**: Health check every 90s with 30s timeout

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 5432, 6333, 8000, 8001, 8002, and 8080 are available
2. **Environment variables**: Verify all required environment variables are set in `.env`
3. **Database migrations**: Run `python manage.py migrate` if database errors occur

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f django_backend
docker-compose logs -f agent_services
```

### Restart Services

```bash
docker-compose restart
```

### Stop All Services

```bash
docker-compose down
```

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]