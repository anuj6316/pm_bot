"""
REST API views for the chatbot app.

Provides HTTP endpoints for managing conversations:
- List all conversations for the authenticated user
- Retrieve a specific conversation with its full message history
- Create a new conversation (can also be done implicitly via WS /new/ route)
- Delete a conversation and all its messages
- List available LLM models for the model selector

Note: Message creation happens exclusively through the WebSocket endpoint.
These HTTP endpoints are for reading history and managing conversations.
"""

import os
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Conversation, Message
from .serializers import (
    ConversationSerializer,
    ConversationDetailSerializer,
    MessageSerializer,
)
from .agent.graph import ALLOWED_MODELS, _DEFAULT_MODEL


# Static metadata for the model selector UI.
# Maps model_id → display info. Kept in sync with graph.ALLOWED_MODELS.
_MODEL_META: dict[str, dict] = {
    "groq/llama-3.3-70b-versatile": {
        "label": "Llama 3.3 70B",
        "provider": "Groq",
        "badge": "Fast · Free tier",
        "env_var": "GROQ_API_KEY",
    },
    "groq/llama3-8b-8192": {
        "label": "Llama 3 8B",
        "provider": "Groq",
        "badge": "Fastest",
        "env_var": "GROQ_API_KEY",
    },
    "groq/mixtral-8x7b-32768": {
        "label": "Mixtral 8x7B",
        "provider": "Groq",
        "badge": "Long context",
        "env_var": "GROQ_API_KEY",
    },
    "openai/gpt-4o-mini": {
        "label": "GPT-4o mini",
        "provider": "OpenAI",
        "badge": "Recommended",
        "env_var": "OPENAI_API_KEY",
    },
    "openai/gpt-4o": {
        "label": "GPT-4o",
        "provider": "OpenAI",
        "badge": "Most capable",
        "env_var": "OPENAI_API_KEY",
    },
    "anthropic/claude-3-5-haiku-20241022": {
        "label": "Claude 3.5 Haiku",
        "provider": "Anthropic",
        "badge": "Fast",
        "env_var": "ANTHROPIC_API_KEY",
    },
    "anthropic/claude-3-5-sonnet-20241022": {
        "label": "Claude 3.5 Sonnet",
        "provider": "Anthropic",
        "badge": "Balanced",
        "env_var": "ANTHROPIC_API_KEY",
    },
    "gemini/gemini-1.5-flash": {
        "label": "Gemini 1.5 Flash",
        "provider": "Google",
        "badge": "Fast",
        "env_var": "GEMINI_API_KEY",
    },
    "gemini/gemini-2.0-flash": {
        "label": "Gemini 2.0 Flash",
        "provider": "Google",
        "badge": "Latest",
        "env_var": "GEMINI_API_KEY",
    },
    "ollama/llama3.2": {
        "label": "Llama 3.2",
        "provider": "Ollama",
        "badge": "Local",
        "env_var": None,
    },
    "ollama/mistral": {
        "label": "Mistral",
        "provider": "Ollama",
        "badge": "Local",
        "env_var": None,
    },
}


class ChatModelListView(APIView):
    """
    GET /api/v1/chat/models/
    Returns the list of available LLM models for the chat model selector.
    Marks each model as `available` based on whether the required env var is set.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        result = []
        for model_id in ALLOWED_MODELS:
            meta = _MODEL_META.get(model_id, {})
            env_var = meta.get("env_var")
            # A model is available if it has no required env var (Ollama) or
            # the env var is set (non-empty)
            available = (env_var is None) or bool(os.environ.get(env_var, "").strip())
            result.append({
                "id": model_id,
                "label": meta.get("label", model_id),
                "provider": meta.get("provider", ""),
                "badge": meta.get("badge", ""),
                "env_var": env_var,
                "available": available,
                "is_default": model_id == _DEFAULT_MODEL,
            })
        return Response(result)


class ConversationListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/v1/chat/conversations/  → list current user's conversations
    POST /api/v1/chat/conversations/  → create a new empty conversation
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConversationSerializer

    def get_queryset(self):
        return (
            Conversation.objects.filter(user=self.request.user)
            .prefetch_related("messages")
            .order_by("-updated_at")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ConversationDetailView(generics.RetrieveDestroyAPIView):
    """
    GET    /api/v1/chat/conversations/<id>/  → retrieve conversation + messages
    DELETE /api/v1/chat/conversations/<id>/  → delete conversation
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConversationDetailSerializer

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user).prefetch_related(
            "messages"
        )


class ConversationMessageListView(generics.ListAPIView):
    """
    GET /api/v1/chat/conversations/<conversation_id>/messages/
    Returns paginated message history for a conversation.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        conversation_id = self.kwargs["conversation_id"]
        # Ensure the conversation belongs to the requesting user
        try:
            conversation = Conversation.objects.get(
                id=conversation_id, user=self.request.user
            )
        except Conversation.DoesNotExist:
            return Message.objects.none()
        return conversation.messages.order_by("created_at")
