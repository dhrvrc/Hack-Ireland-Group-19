import os
import faiss
import pickle

def save_faiss_index_and_metadata(index, metadata, store_dir='rag_store', index_filename='faiss_index.index', metadata_filename='metadata.pkl'):
    """
    Save the FAISS index and metadata to the 'rag_store' directory.

    Args:
        index (faiss.Index): The FAISS index object.
        metadata (dict): A dictionary mapping index positions to metadata.
        store_dir (str): The directory to save the files in (default is 'rag_store').
        index_filename (str): Filename for saving the FAISS index.
        metadata_filename (str): Filename for saving the metadata.
    """
    # Ensure the store directory exists
    os.makedirs(store_dir, exist_ok=True)
    
    # Create full file paths
    index_path = os.path.join(store_dir, index_filename)
    metadata_path = os.path.join(store_dir, metadata_filename)
    
    # Save FAISS index and metadata
    faiss.write_index(index, index_path)
    with open(metadata_path, 'wb') as f:
        pickle.dump(metadata, f)
    
    print(f"Saved FAISS index to {index_path} and metadata to {metadata_path}")


def load_faiss_index_and_metadata(store_dir='rag_store', index_filename='faiss_index.index', metadata_filename='metadata.pkl'):
    """
    Load the FAISS index and metadata from the 'rag_store' directory.

    Args:
        store_dir (str): The directory where the files are stored (default is 'rag_store').
        index_filename (str): Filename from which to load the FAISS index.
        metadata_filename (str): Filename from which to load the metadata.

    Returns:
        tuple: A tuple containing the FAISS index and the metadata dictionary.
    """
    # Create full file paths
    index_path = os.path.join(store_dir, index_filename)
    metadata_path = os.path.join(store_dir, metadata_filename)
    
    # Load FAISS index and metadata
    index = faiss.read_index(index_path)
    with open(metadata_path, 'rb') as f:
        metadata = pickle.load(f)
    
    print(f"Loaded FAISS index from {index_path} and metadata from {metadata_path}")
    return index, metadata

# Example usage:
# To save:
# save_faiss_index_and_metadata(index, metadata)
#
# To load:
# index, metadata = load_faiss_index_and_metadata()
