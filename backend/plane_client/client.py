from dotenv import load_dotenv
import os
import requests
from .exceptions import *

load_dotenv()


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

    def __init__(self):
        self.base_url = os.getenv("PLANE_BASE_URL")
        self.token = os.getenv("PLANE_API_TOKEN")
        self.workspace_slug = os.getenv("PLANE_WORKSPACE_SLUG")
        self.session = requests.Session()
        self.session.headers.update(
            {
                "X-API-Key": f"plane_api_{self.token}",
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
        return self._request(
            "GET", f"/api/v1/workspaces/{self.workspace_slug}/projects/"
        )

    def list_issues(self, project_id: str):
        return self._request(
            "GET",
            f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/issues/",
        )

    def create_issue(self, project_id: str, data: dict):
        return self._request(
            "POST",
            f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/issues/",
            data=data,
        )

    def update_issue(self, project_id: str, issue_id: str, data: dict):
        return self._request(
            "PUT",
            f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/issues/{issue_id}/",
            data=data,
        )

    def delete_issue(self, project_id: str, issue_id: str):
        return self._request(
            "DELETE",
            f"/api/v1/workspaces/{self.workspace_slug}/projects/{project_id}/issues/{issue_id}/",
        )
