# Testing Guide

The testing pipelines for **PM Bot** are established over native Python/Django testing suites utilizing `uv` for sandbox isolation. 

## Automated Test Suites

The current suite encompasses comprehensive checks against the `PlaneClient` handling (simulating 400s, 401s, 404s, and malformed JSON) securely inside `backend/plane_client/tests.py`.

### Running Tests Locally
To execute the tests within your active container environment cleanly:
```bash
docker compose exec django-web uv run python manage.py test
```

When integrating new logic, validation applies to:
- Edge Case Verification (e.g. Broken Payloads).
- Ensuring network timeouts don't hang threads.

## Manual Execution (Cloud Tests)

Certain components strictly require real external context to be tested thoroughly before syncing into the main branch. Standalone sandbox test scripts exist for these:
- `backend/plane_client/cloud_tests.py`: Confirms real authentication against your assigned Plane Workspace directly.

To fire manual integrations:
```bash
docker compose exec django-web uv run python backend/plane_client/cloud_tests.py
```
