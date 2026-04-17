import os
import logging
from typing import Dict, Any
from langchain_community.chat_models import ChatLiteLLM
from langchain_core.messages import SystemMessage, HumanMessage
from .prompts import SYSTEM_PROMPTS

logger = logging.getLogger(__name__)

# Model config from environment (default to global standard)
MODEL_NAME = os.getenv("LLM_MODEL", "openai/gpt-4o-mini")

def _get_llm():
    """Helper to instantiate the LangChain ChatLiteLLM wrapper for tracing."""
    return ChatLiteLLM(
        model=MODEL_NAME,
        streaming=False,
    )

def analyze_issue(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes the issue content to extract key information and sentiment.
    """
    issue_content = state.get("issue_content", "")
    logger.info("Node: Analyzing Issue...")

    model = _get_llm()
    messages = [
        SystemMessage(content=SYSTEM_PROMPTS["analyze"]),
        HumanMessage(content=issue_content),
    ]

    response = model.invoke(messages)
    analysis = response.content
    return {"analysis": str(analysis)}


def triage_issue(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Categorizes the issue based on the analysis.
    """
    analysis = state.get("analysis", "")
    logger.info("Node: Triaging Issue...")

    model = _get_llm()
    messages = [
        SystemMessage(content=SYSTEM_PROMPTS["triage"]),
        HumanMessage(content=f"Analysis: {analysis}"),
    ]

    response = model.invoke(messages)
    category = response.content.strip() if isinstance(response.content, str) else str(response.content).strip()
    return {"category": category}


def generate_response(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Drafts the final response for the user.
    """
    issue_content = state.get("issue_content", "")
    category = state.get("category", "")
    logger.info("Node: Generating Response...")

    model = _get_llm()
    messages = [
        SystemMessage(content=SYSTEM_PROMPTS["generate"]),
        HumanMessage(content=f"Issue: {issue_content}\nCategory: {category}"),
    ]

    response = model.invoke(messages)
    draft_response = response.content
    return {"draft_response": str(draft_response)}
