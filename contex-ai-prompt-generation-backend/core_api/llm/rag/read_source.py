import os
def read_code_files(directory):
    documents = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.py')):
                with open(os.path.join(root, file), 'r') as f:
                    documents.append({
                        "file": os.path.join(root, file),
                        "content": f.read()
                    })
    return documents