from typing import Dict, Any, List
from datetime import datetime

class DocumentStore:
    def __init__(self):
        self.documents: Dict[str, Dict[str, Any]] = {}
        
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
        return doc_id
        
    def get_document(self, doc_id: str) -> Dict[str, Any]:
        """Retrieve a document by its ID"""
        return self.documents.get(doc_id)
        
    def get_all_documents(self) -> Dict[str, Dict[str, Any]]:
        """Get all stored documents"""
        return self.documents
        
    def update_document(self, doc_id: str, **kwargs):
        """Update document attributes"""
        if doc_id in self.documents:
            self.documents[doc_id].update(kwargs)
            
    def clear_all(self):
        """Clear all stored documents"""
        self.documents.clear()
        
    def get_cluster_documents(self) -> Dict[int, List[Dict[str, str]]]:
        """Get documents grouped by their cluster"""
        cluster_docs = {}
        for doc_id, doc in self.documents.items():
            cluster = doc.get('cluster')
            if cluster is not None:
                if cluster not in cluster_docs:
                    cluster_docs[cluster] = []
                cluster_docs[cluster].append({
                    'filename': doc['filename'],
                    'extracted_text': doc['extracted_text'][:100] + '...'  # First 100 chars
                })
        return cluster_docs

# Global instance to be used across the application
document_store = DocumentStore()
