from sentence_transformers import SentenceTransformer
from typing import List
import numpy as np
from scipy.sparse import spmatrix, csr_matrix
import torch

class DocumentVectorizer:
    def __init__(self):
        # Using all-MiniLM-L6-v2 model - good balance of speed and performance
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.vectors = None
        
    def fit_transform_documents(self, processed_texts: List[str]) -> spmatrix:
        """
        Convert preprocessed texts into dense vectors using Sentence Transformer
        Returns: Sparse matrix for compatibility with existing code
        """
        # Get dense vectors from the transformer model
        self.vectors = self.model.encode(processed_texts, 
                                       convert_to_tensor=True,
                                       show_progress_bar=True)
        
        # Convert to numpy and then to sparse matrix for compatibility
        numpy_vectors = self.vectors.cpu().numpy()
        self.vectors = csr_matrix(numpy_vectors)
        return self.vectors
        
    def transform_single_document(self, processed_text: str) -> spmatrix:
        """Transform a single document into a vector"""
        vector = self.model.encode([processed_text], convert_to_tensor=True)
        return csr_matrix(vector.cpu().numpy())
    
    def get_vectors(self) -> spmatrix:
        """Get the current vector matrix"""
        return self.vectors

# Global instance
document_vectorizer = DocumentVectorizer()
