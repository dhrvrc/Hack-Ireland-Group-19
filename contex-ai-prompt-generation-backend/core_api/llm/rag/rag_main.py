import faiss
import numpy as np
from openai import OpenAI
from create_chunks import chunk_text
from read_source import read_code_files
from rag_store_utils import save_faiss_index_and_metadata
from ..config import EMBEDDINGS_SOURCE, OPENAI_API_KEY


client = OpenAI(api_key=OPENAI_API_KEY)

print("Reading code files")
documents = read_code_files(EMBEDDINGS_SOURCE)

index = 0
code_chunks = []
print("Chunking text")
for document in documents:
    for chunk in chunk_text(document["content"]):
        print(index)
        index += 1
        code_chunks.append({
            "file": document["file"],
            "chunk": chunk
        })

def get_embedding(text):
    response = client.embeddings.create(input=text,
    model="text-embedding-ada-002")
    return response.data[0].embedding

print("Getting embeddings")
index = 0
for item in code_chunks:
    item["embedding"] = get_embedding(item["chunk"])
    print(index)
    index += 1

print("Creating index")
dimension = len(code_chunks[0]['embedding'])
index = faiss.IndexFlatL2(dimension)

# Add embeddings to index
embeddings = np.array([item['embedding'] for item in code_chunks]).astype('float32')
index.add(embeddings)

# Map index positions to metadata for retrieval
metadata = {i: {"file": item["file"], "chunk": item["chunk"]} for i, item in enumerate(code_chunks)}

save_faiss_index_and_metadata(index, metadata)
