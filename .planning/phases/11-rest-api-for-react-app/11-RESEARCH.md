# Phase 11: REST API for React Web App - Research (Updated)

**Researched:** 2026-04-16
**Domain:** Django REST Framework + NextJS/React integration with JWT authentication
**Confidence:** HIGH

## Summary

This research update verifies and refreshes the existing Phase 11 research with current library versions, 2026 security best practices, and validated React/Django integration patterns. The standard stack remains stable: DRF for serialization, django-cors-headers for cross-origin support, and djangorestframework-simplejwt for stateless authentication.

Key updates: DRF 3.17.1 (March 2026) dropped Python 3.9 and added Django 6.0 support; SimpleJWT 5.5.1 has no known vulnerabilities but requires careful token storage configuration; CORS-headers 4.9.0 supports Django 4.2-6.0. The critical security insight for 2026: **never store JWT access tokens in localStorage** — use memory + HttpOnly refresh token cookies to prevent XSS token theft.

**Primary recommendation:** Use DRF 3.17.x with SimpleJWT 5.5.x, configure access tokens with 5-15 minute expiry stored in React memory only, refresh tokens in HttpOnly cookies, and implement token blacklisting for logout.

## User Constraints (from CONTEXT.md)

### Locked Decisions
*None — no CONTEXT.md exists for this phase*

### the agent's Discretion
*None — no CONTEXT.md exists for this phase*

### Deferred Ideas (OUT OF SCOPE)
*None — no CONTEXT.md exists for this phase*

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| REQ-001 | State Management (Source of Truth) | DRF serializers expose `AgentIssueSession` model state to React frontend |
| REQ-002 | Asynchronous Processing (The Engine) | API endpoints provide read-only access to Celery task states for dashboard monitoring |
| REQ-003 | Plane Feedback Loop (The UX) | Not directly exposed via REST API — backend-only operations |
| REQ-004 | Agent Reasoning (The Brain) | Not exposed via REST API — internal LangGraph workflow |
| REQ-005 | Observability (The Flight Recorder) | Optional: LangFuse trace IDs could be exposed via API for debugging |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `djangorestframework` | 3.17.1 | REST API serialization, viewsets, authentication | [VERIFIED: PyPI] Latest stable (March 2026), Django 6.0 + Python 3.14 support, dropped Python 3.9 |
| `django-cors-headers` | 4.9.0 | CORS header management for cross-origin React frontend | [VERIFIED: PyPI] Latest stable (Sept 2025), supports Django 4.2-6.0, Python 3.9-3.14 |
| `djangorestframework-simplejwt` | 5.5.1 | JWT token generation, validation, refresh, blacklisting | [VERIFIED: PyPI] Latest stable (July 2025), no known vulnerabilities [CITED: Snyk], RFC 7519 compliant |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `django-filter` | 2.12.0 | Filter querysets via URL parameters | When React frontend needs complex filtering (status, date ranges) |
| `drf-spectacular` | 0.27.0 | OpenAPI 3.0 schema generation | For auto-generated API docs consumed by frontend developers |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| SimpleJWT | `dj-rest-auth` + `django-allauth` | More features (email verification, social auth) but heavier; SimpleJWT sufficient for API-only auth |
| DRF ModelViewSet | Django Ninja (FastAPI-style) | Faster, async-native, but loses DRF ecosystem; DRF preferred for Django-native projects |
| JWT | Session authentication | Simpler but requires CSRF protection, less mobile-friendly; JWT better for detached frontends |

**Installation:**
```bash
pip install djangorestframework==3.17.1 django-cors-headers==4.9.0 djangorestframework-simplejwt==5.5.1
```

**Version verification:**
```bash
pip show djangorestframework          # 3.17.1 (2026-03-24)
pip show django-cors-headers          # 4.9.0 (2025-09-18)
pip show djangorestframework-simplejwt  # 5.5.1 (2025-07-21)
```

## Architecture Patterns

### Recommended Project Structure
```
backend/
├── api/
│   ├── __init__.py
│   ├── v1/                    # API versioning namespace
│   │   ├── __init__.py
│   │   ├── urls.py            # /api/v1/... routes
│   │   ├── serializers/       # DRF serializers
│   │   │   ├── __init__.py
│   │   │   └── session.py     # AgentIssueSessionSerializer
│   │   └── viewsets/          # DRF ViewSets
│   │       ├── __init__.py
│   │       └── session.py     # SessionViewSet
│   ├── authentication.py      # Custom JWT auth classes
│   └── permissions.py         # Custom permission classes
├── settings/
│   ├── base.py
│   ├── dev.py
│   └── prod.py                # CORS_ALLOWED_ORIGINS from env
```

### Pattern 1: Versioned API Routes
**What:** Namespace API routes under `/api/v1/` to allow future breaking changes without disrupting frontend.
**When to use:** Always — even for V1, establishes pattern for evolution.
**Example:**
```python
# backend/api/v1/urls.py
from rest_framework.routers import DefaultRouter
from .viewsets.session import SessionViewSet

router = DefaultRouter()
router.register(r'issues', SessionViewSet, basename='issue-session')

urlpatterns = router.urls
```

### Pattern 2: ReadOnlyModelViewSet for Dashboard
**What:** Use `ReadOnlyModelViewSet` for dashboard endpoints that only read state.
**When to use:** When frontend displays data without modifying it (PM Bot dashboard is read-heavy).
**Example:**
```python
# Source: DRF 3.17 documentation
from rest_framework import viewsets, permissions
from api.v1.serializers.session import SessionSerializer
from core.models import AgentIssueSession

class SessionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Expose agent session states to React dashboard.
    Requires JWT authentication for all operations.
    """
    queryset = AgentIssueSession.objects.all().order_by('-created_at')
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Prevent N+1: prefetch related Plane issue data
        return super().get_queryset().select_related('plane_issue').prefetch_related('langfuse_traces')
```

### Pattern 3: JWT Token Storage (2026 Best Practice)
**What:** Access token in React memory (not localStorage), refresh token in HttpOnly cookie.
**When to use:** Always — prevents XSS token theft.
**Example:**
```typescript
// NextJS frontend — token storage pattern
// Source: Medium "Django + Next.js in 2026" + SimpleJWT docs

// Login handler
async function login(credentials: { email: string; password: string }) {
  const response = await fetch('http://localhost:8002/api/v1/auth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include', // Receive HttpOnly refresh cookie
  });
  
  const data = await response.json();
  // Store access token in memory (React context/state), NOT localStorage
  setAccessToken(data.access); 
  // Refresh token is in HttpOnly cookie — JavaScript cannot access it
}
```

### Anti-Patterns to Avoid
- **❌ Storing JWT in localStorage:** XSS attacks can steal tokens — use memory + HttpOnly cookies [CITED: Medium 2026, SimpleJWT docs]
- **❌ CORS_ALLOW_ALL_ORIGINS = True in production:** Defeats CORS security — always use explicit `CORS_ALLOWED_ORIGINS` [CITED: django-cors-headers docs]
- **❌ Long access token lifetime (>15 minutes):** Increases window for token misuse — keep short, rely on refresh tokens [CITED: SimpleJWT settings]
- **❌ Skipping `select_related()` on list endpoints:** Causes N+1 queries — always optimize queryset [VERIFIED: DRF performance patterns]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JWT token generation/validation | Custom JWT encoding/decoding | `djangorestframework-simplejwt` | Cryptographic edge cases, expiration handling, rotation logic [CITED: SimpleJWT docs] |
| CORS header management | Manual `Access-Control-*` headers | `django-cors-headers` middleware | Preflight (OPTIONS) handling, origin validation, credential support [CITED: django-cors-headers docs] |
| Pagination | Manual offset/limit logic | DRF `PageNumberPagination` or `LimitOffsetPagination` | Consistent response format, cursor navigation, count metadata [VERIFIED: DRF 3.17] |
| Authentication checks | Manual token parsing in views | DRF `permission_classes = [IsAuthenticated]` | Standardized 401 responses, integrates with JWT authentication class [VERIFIED: DRF 3.17] |
| API versioning | Custom URL path parsing | DRF `VersioningScheme` or manual `/api/v1/` namespace | Future-proofing, deprecation strategy, client migration path [ASSUMED] |

**Key insight:** JWT authentication involves cryptographic signing, expiration validation, token rotation, and blacklisting — all solved by SimpleJWT. Custom implementations introduce security vulnerabilities and maintenance burden.

## Common Pitfalls

### Pitfall 1: N+1 Query Explosion on List Endpoints
**What goes wrong:** Serializing `AgentIssueSession` objects triggers individual database queries for related `plane_issue` or `langfuse_traces`.
**Why it happens:** DRF serializers follow foreign keys lazily — each serialized object fires a new query.
**How to avoid:** Override `get_queryset()` with `select_related()` and `prefetch_related()`:
```python
def get_queryset(self):
    return AgentIssueSession.objects.select_related('plane_issue').prefetch_related('langfuse_traces')
```
**Warning signs:** API response time scales linearly with result count; Django debug toolbar shows 50+ queries for single endpoint.

### Pitfall 2: CORS Preflight (OPTIONS) Failures
**What goes wrong:** React frontend sends `Authorization` header, triggering CORS preflight — backend doesn't handle OPTIONS properly.
**Why it happens:** `CorsMiddleware` not positioned correctly in MIDDLEWARE, or `CORS_ALLOW_HEADERS` missing `authorization`.
**How to avoid:**
```python
# settings.py — middleware order CRITICAL
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # MUST be before CommonMiddleware
    "django.middleware.common.CommonMiddleware",
    # ... other middleware
]

CORS_ALLOW_HEADERS = [
    *corsheaders.defaults.default_headers,
    "authorization",  # Required for JWT
]
```
**Warning signs:** Browser console shows `403` on OPTIONS request; network tab shows preflight failure before actual request.

### Pitfall 3: JWT Token Expiration Without Refresh
**What goes wrong:** Access token expires after 5 minutes, frontend gets `401 Unauthorized`, user logged out unexpectedly.
**Why it happens:** Frontend doesn't implement silent refresh flow; refresh token not used.
**How to avoid:** Implement axios/fetch interceptor that catches 401, calls refresh endpoint, retries original request:
```typescript
// NextJS — axios interceptor pattern
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      await refreshAccessToken(); // Call /api/v1/auth/token/refresh/
      return axios(error.config); // Retry original request
    }
    return Promise.reject(error);
  }
);
```
**Warning signs:** Users report "sudden logouts" after ~5 minutes of inactivity; 401 errors on otherwise valid requests.

### Pitfall 4: Hardcoded CORS Origins
**What goes wrong:** `CORS_ALLOWED_ORIGINS` hardcoded to `localhost:3000` — breaks in staging/production.
**Why it happens:** Settings not parameterized by environment.
**How to avoid:**
```python
# settings.py
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[
    "http://localhost:3000",
])
# .env.prod: CORS_ALLOWED_ORIGINS=https://app.pm-bot.com
```
**Warning signs:** Frontend works locally but fails with CORS errors after deployment.

## Code Examples

### DRF ViewSet with Optimization
```python
# Source: DRF 3.17 documentation + research findings
from rest_framework import viewsets, permissions
from rest_framework.pagination import PageNumberPagination
from api.v1.serializers.session import SessionSerializer
from core.models import AgentIssueSession

class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class SessionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Expose agent session states to React dashboard.
    Optimized to prevent N+1 queries.
    """
    queryset = AgentIssueSession.objects.all().order_by('-created_at')
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardPagination
    
    def get_queryset(self):
        return super().get_queryset().select_related(
            'plane_issue'
        ).prefetch_related(
            'langfuse_traces'
        )
```

### SimpleJWT Configuration (2026 Secure Defaults)
```python
# settings.py
from datetime import timedelta

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),  # Short-lived
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),    # Longer-lived
    "ROTATE_REFRESH_TOKENS": True,                  # Security: new refresh token on each use
    "BLACKLIST_AFTER_ROTATION": True,               # Invalidate old refresh tokens
    "ALGORITHM": "HS256",
    "SIGNING_KEY": env("JWT_SIGNING_KEY"),          # Separate from SECRET_KEY
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}
```

### CORS Configuration (Production-Safe)
```python
# settings.py
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[
    "http://localhost:3000",
])
CORS_ALLOW_CREDENTIALS = True  # Required for HttpOnly cookies
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]
CORS_ALLOW_HEADERS = [
    *corsheaders.defaults.default_headers,
    "authorization",
    "content-type",
]
# NEVER use CORS_ALLOW_ALL_ORIGINS = True in production
```

### React/NextJS Login Flow (Secure Token Handling)
```typescript
// NextJS frontend — pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;
  
  // Call Django backend
  const response = await fetch('http://localhost:8002/api/v1/auth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const data = await response.json();
  
  // Set refresh token as HttpOnly cookie (inaccessible to JavaScript)
  res.setHeader('Set-Cookie', `refresh_token=${data.refresh}; HttpOnly; Secure; SameSite=Strict; Path=/`);
  
  // Return access token to client (store in React memory, NOT localStorage)
  return res.status(200).json({ access: data.access });
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JWT in localStorage | Access token in memory, refresh in HttpOnly cookie | 2024-2025 | Prevents XSS token theft — critical security upgrade |
| Session authentication for APIs | JWT with short expiry + rotation | 2023-2024 | Better for detached frontends, mobile apps, microservices |
| Manual CORS headers | `django-cors-headers` middleware | 2020+ | Handles preflight, origin validation, credentials automatically |
| DRF 3.14.x | DRF 3.17.x (Django 6.0, Python 3.14) | March 2026 | Security patches, Python 3.14 support, dropped Python 3.9 |

**Deprecated/outdated:**
- **coreapi:** Dropped in DRF 3.17.0 (March 2026) — use OpenAPI via `drf-spectacular` [VERIFIED: DRF 3.17 release notes]
- **Python 3.9:** No longer supported by DRF 3.17.x — upgrade to Python 3.10+ [VERIFIED: DRF 3.17 release notes]
- **Storing JWT in localStorage:** Now considered anti-pattern — use memory + HttpOnly cookies [CITED: Multiple 2026 sources]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | PM Bot React frontend will run on separate origin (localhost:3000 or deployed domain) | Architecture Patterns | If same-origin, CORS configuration unnecessary but harmless |
| A2 | Frontend team will implement secure token storage (memory + HttpOnly cookies) | Code Examples | If violated, XSS attacks can steal tokens — security vulnerability |
| A3 | API will be read-heavy (dashboard monitoring) with minimal writes | Don't Hand-Roll | If write-heavy, may need additional CSRF protection beyond JWT |

## Open Questions

1. **What is the deployment architecture for the React frontend?**
   - What we know: Frontend is "external NextJS/React" per phase description
   - What's unclear: Will it be hosted on same domain (app.pm-bot.com) or separate (app.pm-bot.com vs api.pm-bot.com)?
   - Recommendation: Assume separate origin for CORS configuration; same-origin deployment simplifies CORS but requires confirmation

2. **Will the React app need write access or is it read-only dashboard?**
   - What we know: Phase description says "interface with the agent backend"
   - What's unclear: Will frontend trigger actions (start/stop agents, modify settings) or only display state?
   - Recommendation: Start with ReadOnlyModelViewSet; add write endpoints if requirements emerge

3. **Is token blacklisting required for logout, or is client-side token deletion sufficient?**
   - What we know: SimpleJWT supports blacklisting via `token_blacklist` app
   - What's unclear: Does PM Bot require immediate session invalidation (security requirement) or is client-side cleanup acceptable?
   - Recommendation: Enable blacklisting for production — adds database overhead but provides true logout

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Python | DRF 3.17.x | ✓ | 3.10+ required | — |
| Django | DRF 3.17.x | ✓ | 4.2-6.0 supported | — |
| PostgreSQL | Production deployment | ✗ | — | SQLite for dev, but requires migration for prod |
| Redis | Celery (existing) | ✓ | Verified in prior phases | — |

**Missing dependencies with no fallback:**
- None — all core dependencies (Python, Django) are available

**Missing dependencies with fallback:**
- PostgreSQL — use SQLite for development, but must configure PostgreSQL for production deployment

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | pytest + pytest-django (existing from prior phases) |
| Config file | `pytest.ini` (exists from Phase 03) |
| Quick run command | `pytest tests/api/ -x` |
| Full suite command | `pytest tests/ -x` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| REQ-001.1 | Session endpoints expose `AgentIssueSession` state | Integration | `pytest tests/api/test_session_endpoints.py -x` | ❌ Wave 0 |
| REQ-001.2 | JWT authentication required for all endpoints | Unit | `pytest tests/api/test_authentication.py -x` | ❌ Wave 0 |
| REQ-003.1 | CORS allows React frontend origin | Integration | `pytest tests/api/test_cors.py -x` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pytest tests/api/ -x`
- **Per wave merge:** `pytest tests/ -x`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `tests/api/test_session_endpoints.py` — covers REQ-001.1 (session serialization, pagination)
- [ ] `tests/api/test_authentication.py` — covers REQ-001.2 (JWT validation, 401 on missing token)
- [ ] `tests/api/test_cors.py` — covers REQ-003.1 (CORS headers, preflight handling)
- [ ] `tests/conftest.py` — shared fixtures (authenticated client, test tokens)

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | `djangorestframework-simplejwt` with short-lived access tokens |
| V3 Session Management | yes | JWT + refresh token rotation + blacklisting |
| V4 Access Control | yes | DRF `permission_classes` + custom permissions |
| V5 Input Validation | yes | DRF serializers (built-in validation) |
| V6 Cryptography | yes | HMAC-SHA256 (HS256) for JWT signing — never hand-roll |

### Known Threat Patterns for DRF + JWT

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| JWT token theft via XSS | Spoofing, Information Disclosure | Store access token in memory (not localStorage), use HttpOnly cookies for refresh tokens |
| Replay attacks with stolen token | Spoofing | Short access token lifetime (5 min), token blacklisting |
| CORS misconfiguration | Spoofing | Explicit `CORS_ALLOWED_ORIGINS`, never `*` in production |
| N+1 query DoS | Denial of Service | `select_related()` + `prefetch_related()` on all list endpoints |
| Brute force on auth endpoint | Tampering | Rate limiting via DRF throttling (`AnonRateThrottle`, `UserRateThrottle`) |
| Token enumeration (user existence) | Information Disclosure | SimpleJWT 5.5.1 returns 401 for invalid user (not 404) [CITED: SimpleJWT CHANGELOG] |

## Sources

### Primary (HIGH confidence)
- [DRF 3.17.1 release notes](https://github.com/encode/django-rest-framework/releases/tag/3.17.1) — version, Python/Django support, breaking changes
- [SimpleJWT 5.5.1 documentation](https://django-rest-framework-simplejwt.readthedocs.io/en/stable/settings.html) — configuration, security settings
- [SimpleJWT CHANGELOG](https://github.com/jazzband/djangorestframework-simplejwt/blob/master/CHANGELOG.md) — security improvements, version history
- [django-cors-headers 4.9.0 documentation](https://github.com/adamchainz/django-cors-headers/blob/main/README.rst) — configuration, middleware order
- [Snyk security report](https://security.snyk.io/package/pip/djangorestframework-simplejwt) — no known vulnerabilities in 5.5.1

### Secondary (MEDIUM confidence)
- [Medium "Django + Next.js in 2026"](https://medium.com/@mmoznu/django-next-js-in-2026-when-to-split-your-frontend-and-backend-and-how-to-wire-them-together-23b4ef68b6df) — JWT storage best practices, integration patterns
- [Django Security Checklist 2026](https://medium.com/@sizanmahmud08/django-security-checklist-protecting-your-web-application-in-2026-f2d1493913a9) — rate limiting, HTTPS, secrets management

### Tertiary (LOW confidence)
- Stack Overflow discussions on NextJS + DRF authentication — community patterns, not authoritative

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified via PyPI, release notes checked
- Architecture: HIGH — DRF patterns from official docs, integration patterns from multiple 2026 sources
- Pitfalls: HIGH — N+1, CORS, JWT expiration are well-documented; XSS storage risk confirmed by 2026 security articles
- Security: HIGH — ASVS mapping based on OWASP standards, threat patterns from SimpleJWT docs + security reports

**Research date:** 2026-04-16
**Valid until:** 2026-07-16 (3 months — stable libraries, but JWT security landscape evolves)
