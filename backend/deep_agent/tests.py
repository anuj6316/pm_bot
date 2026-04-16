from django.test import TestCase
from .models import AgentIssueSession


class SmokeTest(TestCase):
    def test_create_session(self):
        session = AgentIssueSession.objects.create(
            plane_issue_id="TEST-123", status="PENDING", thread_id="THREAD-XYZ"
        )
        self.assertEqual(session.plane_issue_id, "TEST-123")
        self.assertEqual(session.status, "PENDING")
        self.assertEqual(str(session), "Session TEST-123 (PENDING)")

    def test_update_status(self):
        session = AgentIssueSession.objects.create(plane_issue_id="TEST-456")
        session.status = "COMPLETED"
        session.save()
        updated_session = AgentIssueSession.objects.get(plane_issue_id="TEST-456")
        self.assertEqual(updated_session.status, "COMPLETED")
