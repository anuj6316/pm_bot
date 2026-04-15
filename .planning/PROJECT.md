# Project Definition: PM Bot

## Vision
An autonomous, production-grade AI agent integrated with **Plane** to streamline project management. The bot acts as a stateful worker that triages issues, provides instant feedback ("Thinking..."), and generates high-quality responses using a structured **LangGraph** workflow.

## Objectives
- **Automated Triage:** Categorize incoming Plane issues (Bug, Feature, Question).
- **Instant Engagement:** Improve user experience by providing immediate feedback via Plane comments and labels.
- **Resilient Processing:** Use a stateful model (`AgentIssueSession`) and Celery to ensure reliability and horizontal scalability.
- **Observable Reasoning:** Trace every agent decision through **LangFuse**.

## Core Pillars
1. **State & Memory:** Every interaction is tracked in a database to prevent duplicate processing and allow for recovery.
2. **Asynchronous Architecture:** Decouple slow LLM calls from the web request cycle using Celery and Redis.
3. **Structured Reasoning:** Move beyond simple prompts to a multi-node LangGraph for complex decision-making.
4. **Human-Centric UX:** Perception of speed through immediate "Thinking" comments and status labels.

## Tech Stack (Verified)
- **Backend:** Django 6.0, Django REST Framework.
- **Task Queue:** Celery + Redis Stack.
- **Database:** PostgreSQL (pgvector).
- **AI Orchestration:** LangChain, LangGraph, LiteLLM.
- **Observability:** LangFuse.
- **Environment:** Docker, `uv`, `ruff`.

## Out of Scope (V1)
- Multi-platform support beyond Plane (e.g., Jira, GitHub).
- Autonomous code commits or PR generation.
- Real-time WebSocket updates (polling is used for now).
