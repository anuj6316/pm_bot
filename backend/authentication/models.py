from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        DEVELOPER = "developer", "Developer"
        CONSULTANT = "consultant", "Consultant"

    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.DEVELOPER,
    )

    # List of Plane Project UUID codes the user can access (only used for DEVELOPER).
    projects = models.JSONField(
        default=list, blank=True, help_text="List of Plane Project UUIDs"
    )

    # Currently selected project ID (stored for persistence across browsers)
    selected_project = models.CharField(max_length=100, blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

    def has_project_access(self, project_id: str) -> bool:
        if self.role in [self.Role.ADMIN, self.Role.CONSULTANT] or self.is_superuser:
            return True
        if not project_id:
            return False
        return str(project_id).lower() in [str(p).lower() for p in self.projects]

    def get_allowed_projects(self) -> list[str]:
        """Return the list of project IDs this user is authorized to interact with."""
        return self.projects or []
