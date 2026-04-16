import os
import django
import typer
from rich.console import Console

app = typer.Typer()
console = Console()

def init_django():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.backend.settings")
    django.setup()

@app.callback()
def callback():
    """PM Bot CLI - Manage your autonomous PM."""
    init_django()

@app.command()
def status():
    """View status of all active sessions."""
    from deep_agent.models import AgentIssueSession
    from rich.table import Table

    sessions = AgentIssueSession.objects.all().order_by('-created_at')[:10]
    
    table = Table(title="Recent Agent Sessions")
    table.add_column("ID", style="cyan")
    table.add_column("Issue", style="magenta")
    table.add_column("Status", style="green")

    for s in sessions:
        table.add_row(str(s.id), s.plane_issue_id, s.status)
    
    console.print(table)

@app.command()
def sync():
    """Trigger a manual poll of Plane issues."""
    from plane_client.tasks import poll_plane_issues
    poll_plane_issues.delay()
    console.print("[green]Sync task dispatched to Celery worker.[/green]")

if __name__ == "__main__":
    app()
