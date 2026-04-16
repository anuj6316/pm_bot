# Phase 1.1: Plane Cloud Integration (PLAN)

## Goal
Verify the integration between the PM Bot and Plane Cloud after decommissioning the local setup.

## UAT / Verification Criteria
- [ ] Bot successfully connects to `https://app.plane.so`.
- [ ] `PlaneClient` authentication works without local proxy.
- [ ] Integration tests pass (Projects/Issues CRUD).
- [ ] Environment variables in `.env` are correctly mapped.

## Execution Steps
1. **Environment Config:** Update placeholders in `.env` (requires user input).
2. **Client Validation:** Run `backend/plane_client/tests.py` to check for prefix issues or API mismatches.
3. **End-to-End Check:** Create a "GSD Verification" issue in the cloud workspace.

## Dependencies
- Phase 1 (Core structure is in place).
- Plane Cloud API Key & Workspace Slug.
