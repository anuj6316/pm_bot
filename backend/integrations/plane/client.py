import logging
from dotenv import load_dotenv
import os
import requests
from .exceptions import (
    PlaneAPIError,
    PlaneAuthError,
    PlaneNotFoundError,
    PlaneValidationError,
)
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)

load_dotenv()

logger = logging.getLogger(__name__)


class PlaneClient:
    """
    __init__()          ← sets up base URL, token, session
    _request()          ← private method, ALL http calls go through here
    list_projects()     ← calls _request()
    list_issues()       ← calls _request()
    create_issue()      ← calls _request()
    update_issue()      ← calls _request()
    delete_issue()      ← calls _request()
    """

    @retry(
        retry=retry_if_exception_type(PlaneAPIError),
        wait=wait_exponential(multiplier=1, min=2, max=30),
        stop=stop_after_attempt(3),
        reraise=True,
    )
    def __init__(self):
        self.base_url = os.getenv("PLANE_BASE_URL")
        self.token = os.getenv("PLANE_API_TOKEN")
        self.workspace_slug = os.getenv("PLANE_WORKSPACE_SLUG")
        self.session = requests.Session()
        self.session.headers.update(
            {
                "X-API-Key": self.token,
                "Content-Type": "application/json",
            }
        )

    def _request(self, method: str, endpoint: str, data: dict = None):
        url = f"{self.base_url}{endpoint}"
        try:
            response = self.session.request(method, url, json=data)
            response.raise_for_status()

            if response.status_code == 204 or not response.content:
                return None

            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 404:
                raise PlaneNotFoundError(str(e))
            elif e.response.status_code == 401:
                raise PlaneAuthError(str(e))
            elif e.response.status_code == 400:
                raise PlaneValidationError(str(e))
            else:
                raise PlaneAPIError(str(e))
        except (requests.exceptions.JSONDecodeError, ValueError) as e:
            raise PlaneAPIError(f"Failed to parse JSON response: {str(e)}")
        except requests.exceptions.RequestException as e:
            raise PlaneAPIError(str(e))

    def list_projects(self):
        response = self._request(
            "GET", f"/api/v1/workspaces/{self.workspace_slug}/projects/"
        )
        project_count = len(
            response.get("results", [])
            if isinstance(response, dict)
            else (response or [])
        )
        logger.debug("Plane API list_projects: returned %d projects", project_count)
        return response

    def create_project(self, name: str, identifier: str):
        """
        Creates a new project in the workspace.
        """
        endpoint = f"/api/v1/workspaces/{self.workspace_slug}/projects/"
        data = {"name": name, "identifier": identifier}
        return self._request("POST", endpoint, data=data)

    def list_issues(self, project_id: str):
        return self._request(
            "GET",
            f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/issues/",
        )

    def get_issue(self, project_id: str, issue_id: str):
        """Retrieve a single issue by its ID."""
        return self._request(
            "GET",
            f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/issues/{issue_id}/",
        )

    def create_issue(self, project_id: str, data: dict):
        return self._request(
            "POST",
            f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/issues/",
            data=data,
        )

    def create_subtask(self, project_id: str, parent_issue_id: str, data: dict):
        """
        Create a sub-task (child issue) under an existing issue.
        Plane models subtasks as regular issues with a 'parent' field.
        """
        data["parent"] = parent_issue_id
        return self._request(
            "POST",
            f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/issues/",
            data=data,
        )

    def list_subtasks(self, project_id: str, parent_issue_id: str):
        """List all subtasks (children) of an issue."""
        return self._request(
            "GET",
            f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/issues/"
            f"?parent={parent_issue_id}",
        )

    def update_issue(self, project_id: str, issue_id: str, data: dict):
        return self._request(
            "PUT",
            f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/issues/{issue_id}/",
            data=data,
        )

    def patch_issue(self, project_id: str, issue_id: str, data: dict):
        """Partially update an issue (PATCH — only send changed fields)."""
        return self._request(
            "PATCH",
            f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/issues/{issue_id}/",
            data=data,
        )

    def delete_issue(self, project_id: str, issue_id: str):
        return self._request(
            "DELETE",
            f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/issues/{issue_id}/",
        )

    # --- New Methods for Phase 4 ---

    def add_comment(self, project_id: str, issue_id: str, comment_text: str):
        """
        Adds a comment to a Plane issue.
        Note: Plane expects 'comment_json' or 'comment_html'.
        """
        endpoint = f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/issues/{issue_id}/comments/"
        data = {
            "comment_json": {"content": comment_text},
            "comment_html": f"<p>{comment_text}</p>",
        }
        return self._request("POST", endpoint, data=data)

    def list_labels(self, project_id: str):
        """
        Lists all labels available in a project.
        """
        endpoint = (
            f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/labels/"
        )
        return self._request("GET", endpoint)

    def create_label(self, project_id: str, name: str, color: str = "#ff0000"):
        """
        Creates a new label in a project.
        """
        endpoint = (
            f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/labels/"
        )
        data = {"name": name, "color": color}
        return self._request("POST", endpoint, data=data)

    def add_label_to_issue(self, project_id: str, issue_id: str, label_ids: list):
        """
        Attaches labels to an issue. Note: This usually overwrites or patches.
        We provide a list of label IDs.
        """
        endpoint = f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/issues/{issue_id}/"
        data = {"label_ids": label_ids}
        return self._request("PATCH", endpoint, data=data)
