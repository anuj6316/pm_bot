# Debug Session: plane-godmode-404

## Status: FIXING

## Summary
Plane "Get Started" page freezes. User cannot reach login/signup.

## Root Cause

**Confidence: HIGH**

`/god-mode/setup` returns 404. The Plane setup flow redirects from `/setup` → `/god-mode/setup` for admin initialization.

The Caddyfile inside `makeplane/plane-proxy:stable` routes:
- `/god-mode/*` → `admin:3000`
- `/spaces/*` → `space:3000`
- `/*` → `web:3000`

**But in docker-compose.yml:**
- `plane-frontend` has network aliases `web` AND `admin` — wrong
- No container has alias `space`
- No `plane-admin` container exists (should use `makeplane/plane-admin:stable`)
- No `plane-space` container exists (should use `makeplane/plane-space:stable`)

## Evidence
- Browser: http://localhost:8003/god-mode/setup = "404 - Page Not Found"
- Browser: http://localhost:8003/setup = "Plane | Simple, extensible..." (works)
- docker-compose.yml: plane-frontend aliases = [web, admin] (missing space)
- Caddyfile: admin -> routes to admin:3000, space -> routes to space:3000

## Fix
Add `plane-admin` and `plane-space` services to docker-compose.yml.
Remove `admin` alias from `plane-frontend` (keep only `web`).
