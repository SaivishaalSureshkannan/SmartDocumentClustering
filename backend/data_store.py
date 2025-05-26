from typing import Dict, Any, List
from datetime import datetime
import json
from pathlib import Path

class DocumentStore:
    def __init__(self):
        self.documents: Dict[str, Dict[str, Any]] = {}
        self.data_dir = Path(__file__).parent / "data"
        self.data_file = self.data_dir / "document_store.json"
        
        # Create data directory if it doesn't exist
        self.data_dir.mkdir(exist_ok=True)
        
        # Load existing data if available
        self.load_data()
        
    def load_data(self):
        """Load document data from JSON file"""
        try:
            if self.data_file.exists():
                with open(self.data_file, 'r') as f:
                    self.documents = json.load(f)
        except Exception as e:
            print(f"Error loading data: {e}")
            self.documents = {}
            
    def save_data(self):
        """Save document data to JSON file"""
        try:
            with open(self.data_file, 'w') as f:
                json.dump(self.documents, f, indent=2)
        except Exception as e:
            print(f"Error saving data: {e}")
            
    def store_document(self, filename: str, file_type: str, extracted_text: str):
        """Store a document with its metadata and content"""
        doc_id = f"{filename}_{datetime.now().timestamp()}"
        self.documents[doc_id] = {
            'filename': filename,
            'file_type': file_type,
            'extracted_text': extracted_text,
            'upload_timestamp': datetime.now().isoformat(),
            'preprocessed_text': None,  # Will be populated after preprocessing
            'vector': None,  # Will be populated after vectorization
            'cluster': None  # Will be populated after clustering
        }
        self.save_data()
        return doc_id
        
    def get_document(self, doc_id: str) -> Dict[str, Any]:
        """Retrieve a document by its ID"""
        return self.documents.get(doc_id)

    def clear_all(self):
        """Clear all documents and remove the data file"""
        self.documents = {}
        if self.data_file.exists():
            self.data_file.unlink()
            
    def get_all_documents(self) -> Dict[str, Dict[str, Any]]:
        """Get all stored documents"""
        return self.documents
        
    def update_document(self, doc_id: str, **kwargs):
        """Update document attributes"""
        if doc_id in self.documents:
            self.documents[doc_id].update(kwargs)
            self.save_data()
            
    def get_cluster_documents(self) -> Dict[int, List[Dict[str, str]]]:
        """Get documents grouped by their cluster"""
        cluster_docs = {}
        for doc_id, doc in self.documents.items():
            cluster = doc.get('cluster')
            if cluster is not None:
                if cluster not in cluster_docs:
                    cluster_docs[cluster] = []
                cluster_docs[cluster].append({
                    'doc_id': doc_id,
                    'filename': doc['filename'],
                    'extracted_text': doc['extracted_text'][:100] + '...'  # First 100 chars
                })
        return cluster_docs

    def delete_document(self, doc_id: str) -> None:
        """Delete a document from the store"""
        if doc_id in self.documents:
            del self.documents[doc_id]
            self.save_data()

# Global instance to be used across the application
document_store = DocumentStore()
