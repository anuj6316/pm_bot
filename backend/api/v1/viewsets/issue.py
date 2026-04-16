from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from plane_client.client import PlaneClient
from api.v1.serializers.issue import IssueSerializer

class IssueViewSet(viewsets.ViewSet):
    """
    Retrieve issues from Plane.
    """
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        client = PlaneClient()
        # Simple implementation: fetch all projects and their issues
        # Ideally this would be cached or paginated more efficiently
        projects = client.list_projects().get("results", [])
        all_issues = []
        for project in projects:
            issues = client.list_issues(project["id"]).get("results", [])
            all_issues.extend(issues)
        
        serializer = IssueSerializer(all_issues, many=True)
        return Response(serializer.data)
