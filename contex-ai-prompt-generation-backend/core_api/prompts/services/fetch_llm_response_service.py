import os
import faiss
import pickle
import numpy as np
from openai import OpenAI
from llm.openai_client import fetch_response 
from llm.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def get_embedding(text: str) -> list:
    """
    Get the embedding for a given text using OpenAI's embedding API.
    """
    response = client.embeddings.create(input=text,
    model="text-embedding-ada-002")
    return response.data[0].embedding


class FetchLlmResponseService:
    """
    Service class for fetching responses from the LLM with Retrieval-Augmented Generation (RAG).
    """

    @staticmethod
    def load_rag_store(store_dir: str = 'rag_store', index_filename: str = 'faiss_index.index', metadata_filename: str = 'metadata.pkl'):
        """
        Loads the FAISS index and metadata from the 'rag_store' directory.

        Args:
            store_dir (str): Directory where the FAISS index and metadata are stored.
            index_filename (str): Filename of the FAISS index.
            metadata_filename (str): Filename of the metadata pickle.

        Returns:
            tuple: A tuple containing the FAISS index and the metadata dictionary.
        """
        base_dir = os.path.dirname(os.path.abspath(__file__))
        index_path = os.path.join(base_dir, store_dir, index_filename)
        metadata_path = os.path.join(base_dir, store_dir, metadata_filename)
        index = faiss.read_index(index_path)
        with open(metadata_path, 'rb') as f:
            metadata = pickle.load(f)
        return index, metadata

    @staticmethod
    def retrieve_context(prompt: str, index, metadata, top_k: int = 5) -> str:
        """
        Retrieves relevant context for the given prompt using FAISS.

        Args:
            prompt (str): The user prompt.
            index: The loaded FAISS index.
            metadata (dict): The metadata mapping.
            top_k (int): Number of context chunks to retrieve.

        Returns:
            str: Aggregated context string from retrieved chunks.
        """
        # Get the query embedding
        query_embedding = np.array([get_embedding(prompt)]).astype('float32')
        distances, indices = index.search(query_embedding, top_k)
        retrieved_texts = []
        for idx in indices[0]:
            item = metadata.get(idx)
            if item:
                # Format each retrieved item with its file info and snippet.
                retrieved_texts.append(f"File: {item['file']}\nSnippet:\n{item['chunk']}")
        return "\n\n".join(retrieved_texts)

    @staticmethod
    def fetch_response(prompt: str, model: str = "o3-mini") -> str:
        """
        Fetches a response from the LLM for a given prompt, augmenting it with context retrieved via FAISS.

        Args:
            prompt (str): The original user prompt.
            model (str): The LLM model to use.

        Returns:
            str: The LLM's response text.
        """
        # Load the FAISS index and metadata from the "rag_store" directory.
        index, metadata = FetchLlmResponseService.load_rag_store()

        # Retrieve relevant context for the prompt.
        context = FetchLlmResponseService.retrieve_context(prompt, index, metadata, top_k=5)

        # Build the augmented prompt with the retrieved context.
        augmented_prompt = (
            "You are a code generation assistant. Use the following context from our codebase:\n\n"
            f"{context}\n\n"
            "User Request:\n"
            f"{prompt}\n\n"
            "Please generate a complete response based on the above context."
        )
        print(augmented_prompt)

        # Call the original fetch_response with the augmented prompt.
        return fetch_response(augmented_prompt, model=model)
