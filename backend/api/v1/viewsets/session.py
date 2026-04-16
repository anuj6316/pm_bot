from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from api.v1.serializers.session import SessionSerializer
from deep_agent.models import AgentIssueSession
from deep_agent.tasks import trigger_manual_sync


class SessionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Expose agent session states to React dashboard.
    Requires JWT authentication for all operations.
    Optimized to prevent N+1 queries.
    """

    queryset = AgentIssueSession.objects.all().order_by("-created_at")
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset().select_related().prefetch_related()

    @action(detail=True, methods=['post'])
    def sync(self, request, pk=None):
        """
        Trigger manual sync/re-analysis for a specific session.
        """
        session = self.get_object()
        trigger_manual_sync.delay(session.id)
        return Response({"status": "Sync triggered"}, status=status.HTTP_202_ACCEPTED)
