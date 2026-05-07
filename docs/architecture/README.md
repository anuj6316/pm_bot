# PM Bot Architecture Diagrams

This directory contains PlantUML architecture diagrams for the PM Bot system, detailing the structure and flows from a high-level overview down to specific low-level logic implementation.

## How to View

The `.puml` files can be rendered using any standard PlantUML tool, such as:
- [PlantText](https://www.planttext.com/) (Online Viewer)
- PlantUML Extension for VSCode
- IntelliJ IDEA PlantUML Plugin

## Diagrams

### High-Level & Medium-Level

- **[High-Level Architecture](high_level.puml)**: System context boundary showing the main nodes (Frontend, Django Backend, PostgreSQL, Redis, Celery) and their interactions with external systems (Plane.so API, LLM API).
- **[Medium-Level Architecture](medium_level.puml)**: Container and component breakdown showing the inner workings of the Django application (Apps), the Celery worker (LangGraph Brain, Dispatcher), and database/cache connections.

### Low-Level Logic Flows

The following low-level diagrams map out the exact implementation logic including specific files, function names, and variable states:

1. **[Agent Processing Logic](low_level_agent_processing.puml)**
   - **Files**: `backend/agent/tasks.py`, `backend/agent/brain/graph.py`, `backend/agent/brain/nodes.py`
   - Details the execution flow of the AI agent reasoning process using LangGraph's `StateGraph`, the execution of nodes (`analyze_issue`, `triage_issue`, `generate_response`), and updates to the `AgentIssueSession`.

2. **[Plane.so Sync Logic](low_level_plane_sync.puml)**
   - **Files**: `backend/agent/tasks.py`, `backend/integrations/plane/client.py`
   - Details the periodic polling mechanism, how `PlaneClient` interacts with the Plane.so API to fetch projects and issues, and how new issues initiate processing.

3. **[Human-in-the-Loop (HITL) Approval Logic](low_level_hitl_approval.puml)**
   - **Files**: `backend/agent/viewsets.py`, `backend/agent/tasks.py`, `backend/integrations/plane/client.py`
   - Details the user interaction for approving an AI-generated draft, how the Django viewset updates the database state, and the background Celery task (`process_approved_session`) that pushes the final comment and labels to Plane.so.
