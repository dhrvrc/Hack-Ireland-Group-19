import os

from dotenv import load_dotenv

# Load environment variables from a .env file if present
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("Please set the OPENAI_API_KEY environment variable")

EMBEDDINGS_SOURCE = os.getenv("EMBEDDINGS_SOURCE")

if not EMBEDDINGS_SOURCE:
    raise ValueError("Please set the EMBEDDINGS_SOURCE environment variable")
