import faiss
import numpy as np
import openai
from create_chunks import chunk_text
from read_source import read_code_files

from llm.config import EMBEDDINGS_SOURCE, OPENAI_API_KEY

openai.api_key = OPENAI_API_KEY

documents = read_code_files(EMBEDDINGS_SOURCE)

code_chunks = []
for document in documents:
    for chunk in chunk_text(document["content"]):
        code_chunks.append({
            "file": document["file"],
            "chunk": chunk
        })

def get_embedding(text):
    response = openai.Embedding.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response['data'][0]['embedding']

for item in code_chunks:
    item["embedding"] = get_embedding(item["chunk"])
    
dimension = len(code_chunks[0]['embedding'])
index = faiss.IndexFlatL2(dimension)

embeddings = np.array([item['embedding'] for item in code_chunks]).astype('float32')
index.add(embeddings)

# Map index positions to metadata for retrieval
metadata = {i: {"file": item["file"], "chunk": item["chunk"]} for i, item in enumerate(code_chunks)}
