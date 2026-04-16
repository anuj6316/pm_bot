# Roadmap: PM Bot

## Milestone 1: Foundation (State & Memory) - **Current**
*Goal: Establish the stateful tracking system and database schema.*
- [x] **Phase 01: Database Models**
    - Implementation of `AgentIssueSession`.
    - Database migrations.
    - REQ-001 mapping.
- [x] **Phase 01.1: Plane Cloud Integration (Urgent Correction)**
    - Update `PlaneClient` with Cloud API Key.
    - Verify connection to `app.plane.so`.
    - Run CRUD verification tests.

## Milestone 2: Asynchronous Engine
*Goal: Move processing to background workers and implement polling.*
- [x] **Phase 02: Celery Polling**
    - Celery configuration and Beat integration.
    - Polling task development.
    - REQ-002 mapping.

## Milestone 3: The Brain (LangGraph)
*Goal: Implement the core reasoning logic and LLM workflow.*
- [ ] **Phase 03: Reasoning Workflow**
    - LangGraph development.
    - LiteLLM integration.
    - REQ-004 mapping.

## Milestone 4: Integration & UX
*Goal: Connect the brain to the Plane API and finalize the feedback loop.*
- [ ] **Phase 04: Feedback Loop**
    - `PlaneClient` enhancements (labels/comments).
    - Integration of Celery -> LangGraph -> Plane.
    - REQ-003 mapping.

## Milestone 5: Observability & Polishing
*Goal: Add tracing and finalize the V1 release.*
- [ ] **Phase 05: Tracing Cleanup**
    - LangFuse integration.
    - Performance tuning and final testing.
    - REQ-005 mapping.
