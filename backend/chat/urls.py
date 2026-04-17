from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import ConversationViewSet, ChatModelViewSet

router = DefaultRouter()
router.register(r"conversations", ConversationViewSet, basename="conversation")
router.register(r"models", ChatModelViewSet, basename="chat-model")

urlpatterns = [
    path("", include(router.urls)),
]
