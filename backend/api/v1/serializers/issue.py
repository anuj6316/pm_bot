from rest_framework import serializers

class IssueSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField(source='description_stripped', allow_blank=True)
