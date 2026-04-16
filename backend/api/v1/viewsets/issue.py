from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from plane_client.client import PlaneClient
from plane_client.exceptions import PlaneAPIError
import logging

logger = logging.getLogger(__name__)


class IssueViewSet(viewsets.ViewSet):
    """
    Retrieve issues from Plane, organized by project.

    Endpoints:
        GET /api/v1/issues/              → flat list of all issues (with project info)
        GET /api/v1/issues/by_project/  → issues grouped by project (for hierarchy view)
    """
    permission_classes = [permissions.IsAuthenticated]

    def _get_all_projects_and_issues(self):
        """
        Fetch all projects + their issues from Plane.
        Returns (projects, grouped_dict) where grouped_dict maps project_id → {project, issues}.
        """
        client = PlaneClient()
        try:
            projects_data = client.list_projects()
            projects = projects_data.get("results", []) if isinstance(projects_data, dict) else (projects_data or [])
        except PlaneAPIError as e:
            logger.error(f"Failed to fetch projects: {e}")
            return [], {}

        grouped = {}
        for project in projects:
            pid = project.get("id")
            pname = project.get("name", "Unknown Project")
            pidentifier = project.get("identifier", "")
            try:
                issues_data = client.list_issues(pid)
                issues = issues_data.get("results", []) if isinstance(issues_data, dict) else (issues_data or [])
            except PlaneAPIError as e:
                logger.warning(f"Failed to fetch issues for project {pid}: {e}")
                issues = []

            # Embed project context into each issue
            enriched = []
            for issue in issues:
                enriched.append({
                    "id": issue.get("id"),
                    "sequence_id": issue.get("sequence_id"),
                    "name": issue.get("name", ""),
                    "description": issue.get("description_stripped", "") or "",
                    "priority": issue.get("priority", "none"),
                    "state": (issue.get("state_detail") or {}).get("name", "Unknown"),
                    "state_group": (issue.get("state_detail") or {}).get("group", ""),
                    "assignees": issue.get("assignee_ids", []),
                    "label_ids": issue.get("label_ids", []),
                    "created_at": issue.get("created_at"),
                    "updated_at": issue.get("updated_at"),
                    "project_id": pid,
                    "project_name": pname,
                    "project_identifier": pidentifier,
                })

            grouped[pid] = {
                "project": {
                    "id": pid,
                    "name": pname,
                    "identifier": pidentifier,
                    "issue_count": len(enriched),
                },
                "issues": enriched,
            }

        return projects, grouped

    def list(self, request):
        """GET /api/v1/issues/ — flat list of all issues across all projects."""
        _, grouped = self._get_all_projects_and_issues()
        all_issues = []
        for group in grouped.values():
            all_issues.extend(group["issues"])
        return Response(all_issues)

    @action(detail=False, methods=["get"], url_path="by_project")
    def by_project(self, request):
        """
        GET /api/v1/issues/by_project/

        Returns issues grouped by project. Shape:
        [
          {
            "project": { "id", "name", "identifier", "issue_count" },
            "issues": [ { ...issue fields... } ]
          },
          ...
        ]
        """
        _, grouped = self._get_all_projects_and_issues()
        result = sorted(grouped.values(), key=lambda g: g["project"]["name"])
        return Response(result)

    @action(detail=False, methods=["post"], url_path="create")
    def create_issue(self, request):
        """
        POST /api/v1/issues/create/
        Body: { project_id, name, description?, priority? }
        Creates a new issue in the given project.
        """
        project_id = request.data.get("project_id")
        name = request.data.get("name", "").strip()
        if not project_id or not name:
            from rest_framework import status
            return Response({"error": "project_id and name are required."}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            "name": name,
            "priority": request.data.get("priority", "none"),
        }
        if request.data.get("description"):
            data["description"] = request.data["description"]

        try:
            result = PlaneClient().create_issue(project_id, data)
            return Response(result, status=201)
        except PlaneAPIError as e:
            logger.error(f"create_issue error: {e}")
            from rest_framework import status
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)

    @action(detail=False, methods=["post"], url_path="create_subtask")
    def create_subtask(self, request):
        """
        POST /api/v1/issues/create_subtask/
        Body: { project_id, parent_issue_id, name, description?, priority? }
        Creates a sub-task under an existing issue.
        """
        project_id = request.data.get("project_id")
        parent_issue_id = request.data.get("parent_issue_id")
        name = request.data.get("name", "").strip()

        if not project_id or not parent_issue_id or not name:
            from rest_framework import status
            return Response(
                {"error": "project_id, parent_issue_id, and name are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = {
            "name": name,
            "priority": request.data.get("priority", "none"),
        }
        if request.data.get("description"):
            data["description"] = request.data["description"]

        try:
            result = PlaneClient().create_subtask(project_id, parent_issue_id, data)
            return Response(result, status=201)
        except PlaneAPIError as e:
            logger.error(f"create_subtask error: {e}")
            from rest_framework import status
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)


