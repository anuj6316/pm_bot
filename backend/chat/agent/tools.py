"""
Plane tools for the PM Bot conversational agent.

Each function is decorated with @tool (LangChain) so the LangGraph ReAct agent
can discover, call, and interpret them automatically.

All tools instantiate PlaneClient internally — they do NOT share state —
so they remain safe for concurrent async use.
"""

import logging
from langchain_core.tools import tool
from integrations.plane.client import PlaneClient
from integrations.plane.exceptions import PlaneAPIError

logger = logging.getLogger(__name__)


def _client() -> PlaneClient:
    """Factory that returns a fresh PlaneClient instance."""
    return PlaneClient()


# ---------------------------------------------------------------------------
# READ tools
# ---------------------------------------------------------------------------


@tool
def list_projects() -> str:
    """
    List all projects in the Plane workspace.

    Returns a formatted list of projects with their IDs and names.
    Use this when the user asks about available projects or wants to
    browse the workspace.
    """
    try:
        data = _client().list_projects()
        projects = data.get("results", []) if isinstance(data, dict) else data
        if not projects:
            return "No projects found in the workspace."
        lines = [f"- **{p['name']}** (ID: `{p['id']}`)" for p in projects]
        return f"Found {len(projects)} project(s):\n" + "\n".join(lines)
    except PlaneAPIError as e:
        logger.error(f"list_projects tool error: {e}")
        return f"Error fetching projects: {e.message}"


@tool
def list_issues(project_id: str) -> str:
    """
    List all issues in a specific Plane project.

    Args:
        project_id: The UUID of the project (obtain from list_projects).

    Returns a formatted list of issues with ID, name, priority, and status.
    """
    try:
        data = _client().list_issues(project_id)
        issues = data.get("results", []) if isinstance(data, dict) else data
        if not issues:
            return f"No issues found in project `{project_id}`."
        lines = []
        for issue in issues:
            priority = issue.get("priority", "none")
            state = issue.get("state_detail", {}).get("name", "Unknown") if issue.get("state_detail") else "Unknown"
            lines.append(
                f"- **{issue.get('name', 'Untitled')}** | ID: `{issue.get('id')}` | "
                f"Priority: {priority} | State: {state}"
            )
        return f"Found {len(issues)} issue(s) in project `{project_id}`:\n" + "\n".join(lines)
    except PlaneAPIError as e:
        logger.error(f"list_issues tool error: {e}")
        return f"Error fetching issues for project `{project_id}`: {e.message}"


@tool
def get_issue(project_id: str, issue_id: str) -> str:
    """
    Get detailed information about a specific Plane issue.

    Args:
        project_id: The UUID of the project the issue belongs to.
        issue_id: The UUID of the specific issue to retrieve.

    Use this when the user asks about a specific issue by ID.
    """
    try:
        client = _client()
        # list_issues and filter — PlaneClient doesn't have a get_issue method yet
        data = client.list_issues(project_id)
        issues = data.get("results", []) if isinstance(data, dict) else data
        issue = next((i for i in issues if i.get("id") == issue_id), None)
        if not issue:
            return f"Issue `{issue_id}` not found in project `{project_id}`."
        lines = [
            f"**{issue.get('name', 'Untitled')}**",
            f"- **ID:** `{issue.get('id')}`",
            f"- **Priority:** {issue.get('priority', 'none')}",
            f"- **State:** {issue.get('state_detail', {}).get('name', 'Unknown') if issue.get('state_detail') else 'Unknown'}",
            f"- **Description:** {issue.get('description_stripped', 'No description')}",
            f"- **Created:** {issue.get('created_at', 'N/A')}",
        ]
        return "\n".join(lines)
    except PlaneAPIError as e:
        logger.error(f"get_issue tool error: {e}")
        return f"Error fetching issue `{issue_id}`: {e.message}"


@tool
def list_labels(project_id: str) -> str:
    """
    List all labels available in a specific Plane project.

    Args:
        project_id: The UUID of the project.

    Use this before creating or updating an issue with a label.
    """
    try:
        data = _client().list_labels(project_id)
        labels = data.get("results", []) if isinstance(data, dict) else (data or [])
        if not labels:
            return f"No labels found in project `{project_id}`."
        lines = [f"- **{lbl['name']}** (ID: `{lbl['id']}`)" for lbl in labels]
        return f"Found {len(labels)} label(s):\n" + "\n".join(lines)
    except PlaneAPIError as e:
        logger.error(f"list_labels tool error: {e}")
        return f"Error fetching labels: {e.message}"


# ---------------------------------------------------------------------------
# WRITE tools
# ---------------------------------------------------------------------------


@tool
def create_issue(
    project_id: str,
    title: str,
    description: str = "",
    priority: str = "none",
) -> str:
    """
    Create a new issue in a Plane project.

    Args:
        project_id: The UUID of the project to create the issue in.
        title: The issue title/name (required).
        description: Optional detailed description of the issue.
        priority: One of 'urgent', 'high', 'medium', 'low', 'none'. Defaults to 'none'.

    Use this when the user wants to create a new task, bug, or feature request.
    """
    valid_priorities = {"urgent", "high", "medium", "low", "none"}
    if priority not in valid_priorities:
        priority = "none"

    data = {"name": title, "priority": priority}
    if description:
        data["description"] = description

    try:
        result = _client().create_issue(project_id, data)
        return (
            f"✅ Issue created successfully!\n"
            f"- **Title:** {result.get('name')}\n"
            f"- **ID:** `{result.get('id')}`\n"
            f"- **Priority:** {result.get('priority', 'none')}"
        )
    except PlaneAPIError as e:
        logger.error(f"create_issue tool error: {e}")
        return f"Error creating issue: {e.message}"


@tool
def create_subtask(
    project_id: str,
    parent_issue_id: str,
    title: str,
    description: str = "",
    priority: str = "none",
) -> str:
    """
    Create a sub-task (child issue) under an existing Plane issue.

    Args:
        project_id: The UUID of the project.
        parent_issue_id: The UUID of the parent issue this sub-task belongs to.
        title: The sub-task title (required).
        description: Optional detailed description.
        priority: One of 'urgent', 'high', 'medium', 'low', 'none'.

    Use this when the user says 'add a subtask to <issue>', 'create a child task
    under <issue>', or similar. Always confirm the parent issue ID first.
    """
    valid_priorities = {"urgent", "high", "medium", "low", "none"}
    if priority not in valid_priorities:
        priority = "none"

    data = {"name": title, "priority": priority}
    if description:
        data["description"] = description

    try:
        result = _client().create_subtask(project_id, parent_issue_id, data)
        return (
            f"✅ Sub-task created successfully!\n"
            f"- **Title:** {result.get('name')}\n"
            f"- **ID:** `{result.get('id')}`\n"
            f"- **Parent:** `{parent_issue_id}`\n"
            f"- **Priority:** {result.get('priority', 'none')}"
        )
    except PlaneAPIError as e:
        logger.error(f"create_subtask tool error: {e}")
        return f"Error creating sub-task: {e.message}"


@tool
def update_issue(project_id: str, issue_id: str, updates: dict) -> str:
    """
    Update fields of an existing Plane issue.

    Args:
        project_id: The UUID of the project.
        issue_id: The UUID of the issue to update.
        updates: A dictionary of fields to update. Supported keys:
                 'name' (str), 'priority' (str: urgent/high/medium/low/none),
                 'description' (str), 'label_ids' (list of label UUIDs).

    Use this when the user wants to change the priority, title, or other
    attributes of an existing issue.
    """
    try:
        result = _client().update_issue(project_id, issue_id, updates)
        updated_fields = ", ".join(updates.keys())
        return (
            f"✅ Issue `{issue_id}` updated successfully!\n"
            f"- **Updated fields:** {updated_fields}\n"
            f"- **New title:** {result.get('name') if result else 'N/A'}"
        )
    except PlaneAPIError as e:
        logger.error(f"update_issue tool error: {e}")
        return f"Error updating issue `{issue_id}`: {e.message}"


@tool
def add_comment(project_id: str, issue_id: str, comment: str) -> str:
    """
    Add a comment to an existing Plane issue.

    Args:
        project_id: The UUID of the project.
        issue_id: The UUID of the issue to comment on.
        comment: The text content of the comment to post.

    Use this when the user wants to leave a note or update on an issue.
    """
    try:
        _client().add_comment(project_id, issue_id, comment)
        return f"✅ Comment posted to issue `{issue_id}` successfully."
    except PlaneAPIError as e:
        logger.error(f"add_comment tool error: {e}")
        return f"Error adding comment to issue `{issue_id}`: {e.message}"


# ---------------------------------------------------------------------------
# Exported tool list for the agent graph
# ---------------------------------------------------------------------------

PLANE_TOOLS = [
    list_projects,
    list_issues,
    get_issue,
    list_labels,
    create_issue,
    create_subtask,
    update_issue,
    add_comment,
]
