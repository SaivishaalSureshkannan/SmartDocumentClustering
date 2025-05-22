from typing import Dict, Any
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
            'vector': None  # Will be populated after vectorization
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

# Global instance to be used across the application
document_store = DocumentStore()
