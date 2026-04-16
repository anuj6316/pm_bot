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
- [x] **Phase 03: Reasoning Workflow**
    - LangGraph development.
    - LiteLLM integration.
    - REQ-004 mapping.

## Milestone 4: Integration & UX
*Goal: Connect the brain to the Plane API and finalize the feedback loop.*
- [x] **Phase 04: Feedback Loop**
    - `PlaneClient` enhancements (labels/comments).
    - Integration of Celery -> LangGraph -> Plane.
    - REQ-003 mapping.

## Milestone 5: Observability & Polishing
*Goal: Add tracing and finalize the V1 release.*
- [x] **Phase 05: Tracing Cleanup**
    - LangFuse integration (Skipped in favor of Phase 06 Databricks Tracking).
    - Performance tuning and final testing.
    - REQ-005 mapping.
- [x] **Phase 06: Databricks Monitoring**
    - Databricks Cloud Free Edition tracking setup.
    - MLflow Tracing UI integration.

## Milestone 6: V2 Advanced Features (Upcoming)
*Goal: Address technical debt from the V1 MVP and implement scale features.*
- [ ] **Phase 07: Vector Search Context Retrieval**
    - `pgvector` integration for LLM node context enhancement.
- [ ] **Phase 08: Custom HITL Frontend**
    - Transitioning from Django Admin to a distinct NextJS interface for human-in-the-loop approvals.
- [ ] **Phase 09: Multi-Agent Collaboration**
    - Expanding the single LangGraph processor to support multiple sub-agents.
- [ ] **Phase 10: Advanced Databricks Reporting**
    - Custom dashboards to differentiate prompt latencies and tracking models.
- [ ] **Phase 11: REST API for React Web App**
    - Build the REST API which I can integrate into my React web app
    - **Plans:** 3 plans
    - Requirements: REQ-001, REQ-002, REQ-003

---

### Phase 11: REST API for React Web App
Build the REST API which I can integrate into my React web app.

**Goal:** Provide secure, robust Django REST Framework endpoints to interface with the agent backend from an external NextJS/React frontend.

**Dependencies:** None

**Integrates:** None

**Requirements:**
- REQ-001 (State Management)
- REQ-002 (Asynchronous Processing)
- REQ-003 (Plane Feedback Loop)

**Plans:**
- [ ] 11-01-PLAN.md — Install DRF stack with JWT auth and CORS
- [ ] 11-02-PLAN.md — Create API app structure with session endpoints
- [ ] 11-03-PLAN.md — Write comprehensive test suite
