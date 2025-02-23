import faiss
import pickle

def save_faiss_index_and_metadata(index, metadata, index_path='faiss_index.index', metadata_path='metadata.pkl'):
    """
    Save the FAISS index and metadata to disk.

    Args:
        index (faiss.Index): The FAISS index object.
        metadata (dict): A dictionary mapping index positions to metadata (e.g., file info, text snippets).
        index_path (str): File path for saving the FAISS index.
        metadata_path (str): File path for saving the metadata.
    """
    
    faiss.write_index(index, index_path)
    with open(metadata_path, 'wb') as f:
        pickle.dump(metadata, f)
    print(f"Saved FAISS index to {index_path} and metadata to {metadata_path}")


def load_faiss_index_and_metadata(index_path='faiss_index.index', metadata_path='metadata.pkl'):
    """
    Load the FAISS index and metadata from disk.

    Args:
        index_path (str): File path from where to load the FAISS index.
        metadata_path (str): File path from where to load the metadata.

    Returns:
        tuple: A tuple containing the FAISS index and the metadata dictionary.
    """
    index = faiss.read_index(index_path)
    with open(metadata_path, 'rb') as f:
        metadata = pickle.load(f)
    print(f"Loaded FAISS index from {index_path} and metadata from {metadata_path}")
    return index, metadata

# Example usage:
# index, metadata = load_faiss_index_and_metadata()
# save_faiss_index_and_metadata(index, metadata)
