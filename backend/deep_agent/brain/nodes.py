import os
import logging
from typing import Dict, Any
from litellm import completion
from .prompts import SYSTEM_PROMPTS

logger = logging.getLogger(__name__)

# Model config from environment (default to user choice)
MODEL_NAME = os.getenv("LLM_MODEL", "groq/openai/gpt-oss-120b")


def analyze_issue(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes the issue content to extract key information and sentiment.
    """
    issue_content = state.get("issue_content", "")
    logger.info("Node: Analyzing Issue...")

    response = completion(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPTS["analyze"]},
            {"role": "user", "content": issue_content},
        ],
    )

    analysis = response.choices[0].message.content
    return {"analysis": analysis}


def triage_issue(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Categorizes the issue based on the analysis.
    """
    analysis = state.get("analysis", "")
    logger.info("Node: Triaging Issue...")

    response = completion(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPTS["triage"]},
            {"role": "user", "content": f"Analysis: {analysis}"},
        ],
    )

    category = response.choices[0].message.content.strip()
    return {"category": category}


def generate_response(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Drafts the final response for the user.
    """
    issue_content = state.get("issue_content", "")
    category = state.get("category", "")
    logger.info("Node: Generating Response...")

    response = completion(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPTS["generate"]},
            {
                "role": "user",
                "content": f"Issue: {issue_content}\nCategory: {category}",
            },
        ],
    )

    draft_response = response.choices[0].message.content
    return {"draft_response": draft_response}
