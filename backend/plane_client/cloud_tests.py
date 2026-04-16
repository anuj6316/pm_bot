import os
import requests
import unittest
from dotenv import load_dotenv

# Load .env for local run, although django settings will be used in docker
load_dotenv()


class PlaneCloudIntegrationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.api_token = os.getenv("PLANE_API_TOKEN")
        cls.workspace_slug = os.getenv("PLANE_WORKSPACE_SLUG")
        cls.base_url = os.getenv("PLANE_BASE_URL", "https://app.plane.so").rstrip("/")

        if not cls.api_token or not cls.workspace_slug:
            raise unittest.SkipTest("Plane credentials missing in environment")

        cls.headers = {
            "X-API-Key": cls.api_token,
            "Content-Type": "application/json",
        }

    def test_01_authentication(self):
        """Test if the API key is valid by fetching current user info."""
        url = f"{self.base_url}/api/v1/users/me/"
        response = requests.get(url, headers=self.headers)

        print(f"\n[DEBUG] URL: {url}")
        print(f"[DEBUG] Status: {response.status_code}")
        print(f"[DEBUG] Response Text: {response.text[:500]}")  # Show first 500 chars

        self.assertEqual(
            response.status_code, 200, f"Auth failed with status {response.status_code}"
        )
        data = response.json()
        print(f"[AUTH SUCCESS] Authenticated as: {data.get('email', 'Unknown')}")

    def test_02_workspace_access(self):
        """Test if the workspace slug is valid and accessible."""
        url = f"{self.base_url}/api/v1/workspaces/{self.workspace_slug}/"
        response = requests.get(url, headers=self.headers)

        self.assertEqual(
            response.status_code, 200, f"Workspace access failed: {response.text}"
        )
        data = response.json()
        print(f"[WORKSPACE SUCCESS] Access confirmed to: {data.get('name', 'Unknown')}")

    def test_03_projects_list(self):
        """Test if we can list projects in the workspace."""
        url = f"{self.base_url}/api/v1/workspaces/{self.workspace_slug}/projects/"
        response = requests.get(url, headers=self.headers)

        self.assertEqual(
            response.status_code, 200, f"Failed to list projects: {response.text}"
        )
        data = response.json()
        projects = data.get("results", [])
        print(f"[PROJECTS SUCCESS] Found {len(projects)} projects.")

        if len(projects) > 0:
            p = projects[0]
            print(f"Sample Project: {p.get('name')} ({p.get('identifier')})")


if __name__ == "__main__":
    unittest.main()
