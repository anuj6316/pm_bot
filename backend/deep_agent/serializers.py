from rest_framework import serializers
from .models import AgentIssueSession

class AgentIssueSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentIssueSession
        fields = [
            'id', 
            'plane_issue_id', 
            'status', 
            'thread_id', 
            'error_log', 
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
