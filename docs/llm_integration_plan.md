# Implementation Plan: Production-Grade LLM Integration

This document outlines the architecture and implementation strategy for integrating an AI Agent into the PM Bot. The goal is to provide a "perfect" user experience (UX) that is scalable, resilient, and observable.

---

## 1. Architectural Overview: The "Stateful Agent" Pattern

Most AI integrations fail in production because they treat LLMs as simple functions. We will treat the AI as a **Stateful Worker**.

### **Reasoning:**
- **Reliability:** If the LLM times out or the network drops, we need to know exactly where the process stopped so we can retry.
- **Cost Efficiency:** We must prevent "Double Processing" (running the same expensive LLM call twice for the same issue).
- **UX:** Users need to see that the bot is "working" even if the LLM takes 30 seconds to respond.

---

## 2. Component Breakdown

### **Phase 1: The Foundation (State & Memory)**
**Component:** `AgentIssueSession` (Django Model)
- **Goal:** Create a record for every Plane issue the bot encounters.
- **Fields:** `plane_issue_id`, `status` (PENDING, THINKING, COMPLETED, FAILED), `thread_id` (for conversation memory), and `error_log`.
- **Reasoning:** This is our **Source of Truth**. It allows us to scale horizontally. 10 Celery workers can check the database to ensure they aren't working on the same issue.

### **Phase 2: The Engine (Asynchronous Processing)**
**Component:** Celery + Redis
- **Goal:** Move all LLM logic out of the web request.
- **Workflow:**
    1.  A "Polling Task" checks Plane for new issues.
    2.  For each new issue, it creates an `AgentIssueSession` and triggers a "Process Task".
    3.  The "Process Task" handles the actual LLM call.
- **Reasoning:** LLMs are slow. Asynchronous processing prevents web server timeouts and allows us to handle thousands of issues in parallel using a queue.

### **Phase 3: The Brain (LangGraph Workflow)**
**Component:** LangGraph + LiteLLM
- **Goal:** Move from a single prompt to a structured graph.
- **Graph Nodes:**
    - **`analyze_issue`**: Categorize the request (Bug, Feature, Question).
    - **`search_context`**: (Future) Search internal documentation or code.
    - **`generate_response`**: Draft the final answer.
    - **`quality_check`**: Verify the answer isn't hallucinated.
- **Reasoning:** LangGraph allows for "loops" and "decisions." If the `quality_check` fails, the agent can loop back and try again. LiteLLM provides a unified API for OpenAI/Anthropic and handles retries automatically.

### **Phase 4: Perfect UX (The Feedback Loop)**
**Component:** Plane API (via `PlaneClient`)
- **Step 1 (Immediate):** As soon as the AI starts, post a comment: *"I'm looking into this... 🔍"* and add a `bot-processing` label.
- **Step 2 (Final):** Once the LLM finishes, edit the comment with the final answer and remove the label.
- **Reasoning:** Perception of speed is more important than actual speed. Instant feedback keeps the user from feeling "ignored" by the system.

### **Phase 5: Observability (The Flight Recorder)**
**Component:** LangFuse
- **Goal:** Record every single step of the agent's reasoning.
- **Reasoning:** You cannot debug an LLM in production without traces. LangFuse shows you the exact prompt sent, the latency, and the token cost for every single interaction.

---

## 3. Step-by-Step Execution Path

1.  **[ ] Data Model:** Finalize `AgentIssueSession` and run migrations.
2.  **[ ] Polling Mechanism:** Implement a Celery Beat task that fetches "Unprocessed" issues from Plane.
3.  **[ ] Instant Feedback:** Update the `PlaneClient` to support adding/removing labels and posting "Thinking" comments.
4.  **[ ] The Graph:** Build a basic 3-node LangGraph (Analyze -> Generate -> Review).
5.  **[ ] Integration:** Connect the Celery task to the LangGraph execution.
6.  **[ ] Monitoring:** Initialize LangFuse to track the first live runs.

---

## 4. Scalability Considerations

- **Rate Limiting:** Use Celery's `rate_limit` feature to ensure we don't exceed our LLM API limits (e.g., 50 calls per minute).
- **Concurrency:** Adjust the number of Celery workers based on the volume of Plane issues.
- **Database Scaling:** Since we use indexed `plane_issue_id`, fetching the status is extremely fast even with millions of records.
