from django.urls import path
from .viewsets import UserViewSet

urlpatterns = [
    path(
        "",
        UserViewSet.as_view(
            {
                "get": "profile",
                "put": "update_profile",
                "patch": "partial_update_profile",
            }
        ),
        name="user",
    ),
    path(
        "change-password/",
        UserViewSet.as_view({"post": "change_password"}),
        name="user-change-password",
    ),
    path("logout/", UserViewSet.as_view({"post": "logout"}), name="user-logout"),
]
