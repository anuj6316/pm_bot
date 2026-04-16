from celery import shared_task
from .models import AgentIssueSession
from .tasks import run_brain
import logging

logger = logging.getLogger(__name__)

@shared_task(name="deep_agent.tasks.trigger_manual_sync")
def trigger_manual_sync(session_id):
    session = AgentIssueSession.objects.get(id=session_id)
    session.status = "PROCESSING"
    session.save()
    
    # Simple logic to re-run brain or perform sync
    # This might need refinement based on how run_brain is invoked in polling task
    # For now, just logging to confirm it triggers
    logger.info(f"Manual sync triggered for session {session_id}")
    return "Sync Triggered"
