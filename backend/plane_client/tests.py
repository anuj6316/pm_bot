from django.test import TestCase
from unittest.mock import patch, MagicMock
from .client import PlaneClient
from .exceptions import (
    PlaneAuthError,
    PlaneNotFoundError,
    PlaneValidationError,
    PlaneAPIError,
)
import requests


class PlaneClientTests(TestCase):
    def setUp(self):
        # Mock environment variables
        self.env_patcher = patch.dict(
            "os.environ",
            {
                "PLANE_BASE_URL": "http://api.plane.so",
                "PLANE_API_TOKEN": "test_token",
                "PLANE_WORKSPACE_SLUG": "test_workspace",
            },
        )
        self.env_patcher.start()
        self.client = PlaneClient()

    def tearDown(self):
        self.env_patcher.stop()

    @patch("requests.Session.request")
    def test_list_projects_success(self, mock_request):
        # Configure mock response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = [{"id": "p1", "name": "Project 1"}]
        mock_request.return_value = mock_response

        projects = self.client.list_projects()

        self.assertEqual(len(projects), 1)
        self.assertEqual(projects[0]["name"], "Project 1")
        mock_request.assert_called_once_with(
            "GET",
            "http://api.plane.so/api/v1/workspaces/test_workspace/projects/",
            json=None,
        )

    @patch("requests.Session.request")
    def test_create_issue_success(self, mock_request):
        mock_response = MagicMock()
        mock_response.status_code = 201
        mock_response.json.return_value = {"id": "i1", "name": "New Issue"}
        mock_request.return_value = mock_response

        issue_data = {"name": "New Issue", "priority": "high"}
        issue = self.client.create_issue("project_id_1", issue_data)

        self.assertEqual(issue["name"], "New Issue")
        mock_request.assert_called_once_with(
            "POST",
            "http://api.plane.so/api/v1/workspaces/test_workspace/projects/project_id_1/issues/",
            json=issue_data,
        )

    @patch("requests.Session.request")
    def test_auth_error_raises_plane_auth_error(self, mock_request):
        # Simulate 401 Unauthorized
        mock_response = MagicMock()
        mock_response.status_code = 401
        # requests.Session.request raises HTTPError if raise_for_status() is called
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError(
            response=mock_response
        )
        mock_request.return_value = mock_response

        with self.assertRaises(PlaneAuthError):
            self.client.list_projects()

    @patch("requests.Session.request")
    def test_not_found_error_raises_plane_not_found_error(self, mock_request):
        # Simulate 404 Not Found
        mock_response = MagicMock()
        mock_response.status_code = 404
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError(
            response=mock_response
        )
        mock_request.return_value = mock_response

        with self.assertRaises(PlaneNotFoundError):
            self.client.delete_issue("p1", "i1")

    @patch("requests.Session.request")
    def test_validation_error_raises_plane_validation_error(self, mock_request):
        # Simulate 400 Bad Request
        mock_response = MagicMock()
        mock_response.status_code = 400
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError(
            response=mock_response
        )
        mock_request.return_value = mock_response

        with self.assertRaises(PlaneValidationError):
            self.client.create_issue("p1", {"invalid": "data"})

    @patch("requests.Session.request")
    def test_generic_api_error_raises_plane_api_error(self, mock_request):
        # Simulate 500 Internal Server Error
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError(
            response=mock_response
        )
        mock_request.return_value = mock_response

        with self.assertRaises(PlaneAPIError):
            self.client.list_projects()

    @patch("requests.Session.request")
    def test_request_timeout(self, mock_request):
        # Simulate a connection timeout
        mock_request.side_effect = requests.exceptions.Timeout("Connection timed out")

        with self.assertRaises(PlaneAPIError) as cm:
            self.client.list_projects()

        self.assertIn("Connection timed out", str(cm.exception))

    @patch("requests.Session.request")
    def test_malformed_json_response(self, mock_request):
        # Simulate 200 OK but invalid JSON body
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.side_effect = ValueError("No JSON object could be decoded")
        mock_request.return_value = mock_response

        with self.assertRaises(PlaneAPIError) as cm:
            self.client.list_projects()

        self.assertIn("No JSON object could be decoded", str(cm.exception))

    @patch("requests.Session.request")
    def test_204_no_content_success(self, mock_request):
        # Simulate 204 No Content (common for DELETE)
        mock_response = MagicMock()
        mock_response.status_code = 204
        mock_response.json.side_effect = ValueError("No JSON object could be decoded")
        mock_request.return_value = mock_response

        # This will reveal if the client crashes on .json()
        result = self.client.delete_issue("p1", "i1")
        self.assertIsNone(result)
