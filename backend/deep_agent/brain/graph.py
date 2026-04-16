import logging
from typing import Dict, Any, TypedDict
from langgraph.graph import StateGraph, END
from .nodes import analyze_issue, triage_issue, generate_response

logger = logging.getLogger(__name__)


class AgentState(TypedDict):
    """
    State stored throughout the LangGraph workflow.
    """

    issue_content: str
    analysis: str
    category: str
    draft_response: str
    error: str


def create_agent_graph():
    """
    Creates and compiles the LangGraph reasoning workflow.
    """
    # 1. Initialize the Graph
    workflow = StateGraph(AgentState)

    # 2. Add Nodes
    workflow.add_node("analyze", analyze_issue)
    workflow.add_node("triage", triage_issue)
    workflow.add_node("generate", generate_response)

    # 3. Define Edges (Sequential for now)
    workflow.set_entry_point("analyze")
    workflow.add_edge("analyze", "triage")
    workflow.add_edge("triage", "generate")
    workflow.add_edge("generate", END)

    # 4. Compile
    return workflow.compile()


# Singleton instance of the graph
brain_graph = create_agent_graph()


def run_brain(issue_content: str) -> Dict[str, Any]:
    """
    Helper function to execute the brain workflow for a given issue.
    """
    initial_state = {
        "issue_content": issue_content,
        "analysis": "",
        "category": "",
        "draft_response": "",
        "error": "",
    }

    try:
        final_state = brain_graph.invoke(initial_state)
        return final_state
    except Exception as e:
        logger.error(f"Error executing LangGraph: {str(e)}")
        return {**initial_state, "error": str(e)}
