from django.apps import AppConfig


class ChatbotConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "chatbot"
    verbose_name = "Chatbot"

    def ready(self):
        """
        Disable MLflow LangChain/LangGraph autologging.

        Root cause of 'ContextVar was created in a different Context' warning:
        MLflow autologging patches LangChain callbacks and stores ContextVar tokens
        in the main thread's asyncio context. When Daphne spawns a new asyncio task
        for each WebSocket message (via LangGraph's astream()), Python's asyncio
        creates a *copy* of the parent context — so the ContextVar token belongs to
        the parent and cannot be reset() from the child task, producing the warning.

        Disabling autologging prevents MLflow from creating those tokens at all.
        Explicit mlflow.log_* calls still work if needed in the future.
        """
        try:
            import mlflow
            mlflow.langchain.autolog(disable=True)
        except Exception:
            pass  # MLflow not installed or not configured — safe to ignore
