from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from drf_spectacular.types import OpenApiTypes

from .serializers import UserProfileSerializer, ChangePasswordSerializer


class UserViewSet(viewsets.ViewSet):
    """
    ViewSet for User Profile management, Password Change, and Logout.
    """

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "change_password":
            return ChangePasswordSerializer
        return UserProfileSerializer

    def profile(self, request):
        """GET /api/v1/user/ - Get current user profile"""
        serializer = UserProfileSerializer(request.user)
        return Response(
            {"msg": "User profile fetched successfully", "data": serializer.data}
        )

    def update_profile(self, request):
        """PUT /api/v1/user/ - Update current user profile"""
        serializer = UserProfileSerializer(
            request.user, data=request.data, partial=False
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"msg": "User profile updated successfully", "data": serializer.data}
            )
        return Response(
            {"msg": "Failed to update profile", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def partial_update_profile(self, request):
        """PATCH /api/v1/user/ - Partial update current user profile"""
        serializer = UserProfileSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"msg": "User profile updated successfully", "data": serializer.data}
            )
        return Response(
            {"msg": "Failed to update profile", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @extend_schema(
        summary="Change password",
        request=ChangePasswordSerializer,
        responses={200: OpenApiTypes.OBJECT},
    )
    def change_password(self, request):
        """POST /api/v1/user/change-password/ - Change user password"""
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data.get("old_password")):
                return Response(
                    {"msg": "Old password is incorrect"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.set_password(serializer.validated_data.get("new_password"))
            user.save()

            return Response({"msg": "Password changed successfully"})

        return Response(
            {"msg": "Failed to change password", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @extend_schema(
        summary="Logout",
        description="Blacklist the refresh token to logout.",
        responses={200: OpenApiTypes.OBJECT},
    )
    def logout(self, request):
        """POST /api/v1/user/logout/ - Logout user and blacklist tokens"""
        try:
            refresh_token = request.data.get("refresh_token")
            if refresh_token:
                from rest_framework_simplejwt.tokens import RefreshToken

                token = RefreshToken(refresh_token)
                token.blacklist()

            return Response({"msg": "Logged out successfully"})
        except Exception:
            return Response({"msg": "Logged out"}, status=status.HTTP_200_OK)
