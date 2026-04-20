"""
PM Bot - Autonomous Project Management Assistant

This module serves as the main entry point for the PM Bot application.
"""

from smolagents import CodeAgent, InferenceClientModel


def create_agent(model_id: str = "meta-llama/Llama-3.3-70B-Instruct") -> CodeAgent:
    """Create and configure a CodeAgent instance.
    
    Args:
        model_id: The Hugging Face model ID to use for inference.
        
    Returns:
        Configured CodeAgent instance with base tools enabled.
    """
    return CodeAgent(
        model=InferenceClientModel(model_id=model_id),
        add_base_tools=True
    )


def run_agent_query(agent: CodeAgent, query: str, sound_file_url: str | None = None) -> str:
    """Execute an agent query with optional audio context.
    
    Args:
        agent: The CodeAgent instance to use.
        query: The question or task to execute.
        sound_file_url: Optional URL to an MP3 file for audio context.
        
    Returns:
        The agent's response string.
    """
    additional_args = {}
    if sound_file_url:
        additional_args["mp3_sound_file_url"] = sound_file_url
    
    return agent.run(query, additional_args=additional_args)


def main():
    """Main entry point for PM Bot."""
    print("Hello from PM Bot!")


if __name__ == "__main__":
    main()
