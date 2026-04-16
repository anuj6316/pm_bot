from rest_framework.routers import DefaultRouter
from .viewsets.session import SessionViewSet
from .viewsets.issue import IssueViewSet

router = DefaultRouter()
router.register(r"sessions", SessionViewSet, basename="session")
router.register(r"issues", IssueViewSet, basename="issue")

urlpatterns = router.urls
