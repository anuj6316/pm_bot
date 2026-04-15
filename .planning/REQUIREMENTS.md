# Requirements: PM Bot

## V1: Foundation & Core Logic

### REQ-001: State Management (Source of Truth)
- **[ ] REQ-001.1:** Implement `AgentIssueSession` model to track `plane_issue_id`, `status`, `thread_id`, and `error_log`.
- **[ ] REQ-001.2:** Implement database migrations for the new state model.

### REQ-002: Asynchronous Processing (The Engine)
- **[ ] REQ-002.1:** Configure Celery Beat for periodic polling of Plane issues.
- **[ ] REQ-002.2:** Implement background task to identify and initialize sessions for "Unprocessed" issues.
- **[ ] REQ-002.3:** Implement worker task for executing the LangGraph reasoning workflow.

### REQ-003: Plane Feedback Loop (The UX)
- **[ ] REQ-003.1:** Add support for posting "Thinking..." comments to `PlaneClient`.
- **[ ] REQ-003.2:** Add support for adding/removing labels (e.g., `bot-processing`) to `PlaneClient`.
- **[ ] REQ-003.3:** Implement logic to edit initial comments with final agent responses.

### REQ-004: Agent Reasoning (The Brain)
- **[ ] REQ-004.1:** Build a 3-node LangGraph (Analyze -> Generate -> Review).
- **[ ] REQ-004.2:** Integrate LiteLLM for multi-provider support and retry logic.
- **[ ] REQ-004.3:** Implement basic prompt templates for triage and response.

### REQ-005: Observability (The Flight Recorder)
- **[ ] REQ-005.1:** Integrate LangFuse for tracing LangGraph nodes and LLM calls.
- **[ ] REQ-005.2:** Log cost and latency for every interaction.

## V2: Advanced Features (Future)
- **REQ-006:** Vector Search Integration (using `pgvector`) for context retrieval.
- **REQ-007:** Human-in-the-Loop (HITL) approval gates for sensitive actions.
- **REQ-008:** Multi-agent collaboration for complex issue resolution.
