"""
URL configuration for PM Bot backend.

HTTP Routes:
    /admin/                                → Django admin panel
    /api/v1/auth/token/                    → JWT login (POST: {username, password})
    /api/v1/auth/token/refresh/            → JWT refresh (POST: {refresh})
    /api/v1/auth/token/blacklist/          → JWT logout/blacklist (POST: {refresh})
    /api/v1/sessions/                      → Agent issue sessions (read-only)
    /api/v1/issues/                        → Plane issues proxy (read-only)
    /api/v1/chat/conversations/            → Chatbot conversation management

WebSocket Routes (handled by ASGI/Channels):
    ws://.../ws/chat/new/                  → Start a new conversation
    ws://.../ws/chat/<conversation_id>/    → Resume an existing conversation
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # ── JWT Authentication ──────────────────────────────────────────
    path("api/v1/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/v1/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/v1/auth/token/blacklist/", TokenBlacklistView.as_view(), name="token_blacklist"),

    # ── Agent Sessions + Issues (existing) ─────────────────────────
    path("api/v1/", include("api.v1.urls")),

    # ── Chatbot REST API ────────────────────────────────────────────
    path("api/v1/chat/", include("chatbot.urls")),
]
