from django.urls import path
from .viewsets import UserViewSet

urlpatterns = [
    # ── User Management (Specific paths first) ────────────────────────
    path(
        "list_users/",
        UserViewSet.as_view({"get": "list_users"}),
        name="list-users",
    ),
    path(
        "create-user/",
        UserViewSet.as_view({"post": "create_user"}),
        name="create-user",
    ),
    path(
        "set-role/<int:pk>/",
        UserViewSet.as_view({"post": "set_role"}),
        name="set-role",
    ),
    # ── Password & Session ────────────────────────────────────────────
    path(
        "change-password/",
        UserViewSet.as_view({"post": "change_password"}),
        name="change-password",
    ),
    path(
        "logout/",
        UserViewSet.as_view({"post": "logout"}),
        name="logout",
    ),
    path(
        "projects/",
        UserViewSet.as_view({"get": "projects"}),
        name="user-projects",
    ),
    path(
        "set-selected-project/",
        UserViewSet.as_view({"post": "set_selected_project"}),
        name="set-selected-project",
    ),
    # ── Current User Profile (Root match last) ────────────────────────
    path(
        "",
        UserViewSet.as_view(
            {
                "get": "list",
                "put": "update",
                "patch": "partial_update",
            }
        ),
        name="user-profile",
    ),
]
