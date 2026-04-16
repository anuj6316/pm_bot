from django.contrib import admin
from .models import AgentIssueSession

from .tasks import process_approved_session


@admin.register(AgentIssueSession)
class AgentIssueSessionAdmin(admin.ModelAdmin):
    list_display = (
        "plane_issue_id",
        "status",
        "triage_label",
        "is_approved",
        "updated_at",
    )
    list_filter = ("status", "is_approved", "triage_label")
    search_fields = ("plane_issue_id", "thread_id")
    readonly_fields = ("created_at", "updated_at")
    actions = ["approve_and_post"]

    @admin.action(description="Approve and Post to Plane")
    def approve_and_post(self, request, queryset):
        for session in queryset:
            if session.status == "COMPLETED":
                session.is_approved = True
                session.save()
                process_approved_session.delay(session.id)
        self.message_user(
            request, "Selected sessions approved and scheduled for posting."
        )
