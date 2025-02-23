from llm.openai_client import fetch_response


class FetchLlmResponseService:
    """
    Service class for fetching responses from the LLM.
    """

    @staticmethod
    def fetch_response(prompt: str, model: str = "o3-mini") -> str:
        """
        Fetches a response from the LLM for a given prompt.

        Args:
            prompt (str): The prompt to send to the LLM.
            model (str): The LLM model to use.

        Returns:
            str: The LLM's response text.
        """
        return fetch_response(prompt, model=model)