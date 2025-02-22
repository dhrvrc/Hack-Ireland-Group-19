# llm/client.py
from openai import OpenAI
from .config import OPENAI_API_KEY

# Initialize the OpenAI client instance
client = OpenAI(api_key=OPENAI_API_KEY)

def fetch_response(prompt, model="o3-mini"):
    """
    Fetches a response from the OpenAI API for a given prompt using the OpenAI client.
    
    Args:
        prompt (str): The prompt to send to the API.
        model (str): The OpenAI model to use.
        **kwargs: Additional keyword arguments for the API call (e.g., max_tokens).
    
    Returns:
        str or None: The API's response text, or None if an error occurs.
    """
    try:
        response = client.chat.completions.create(
              model="gpt-3.5-turbo",
             messages=[
        {
            "role": "user", 
            "content": f"Generate a React component based on the following prompt: {prompt}"
        }
    ]
        )
        return response.choices[0].message.content
    except Exception as e:

        print(f"Error fetching response: {e}")
        return None
