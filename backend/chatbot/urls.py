from django.urls import path
from . import views

urlpatterns = [
    # Available LLM models for the UI model selector
    path(
        "models/",
        views.ChatModelListView.as_view(),
        name="chat-models",
    ),
    # Conversation list + create
    path(
        "conversations/",
        views.ConversationListCreateView.as_view(),
        name="conversation-list",
    ),
    # Conversation detail + delete
    path(
        "conversations/<uuid:pk>/",
        views.ConversationDetailView.as_view(),
        name="conversation-detail",
    ),
    # Paginated message history for a conversation
    path(
        "conversations/<uuid:conversation_id>/messages/",
        views.ConversationMessageListView.as_view(),
        name="conversation-messages",
    ),
]
