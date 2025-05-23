from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List, Tuple
import numpy as np
from scipy.sparse import spmatrix

class DocumentVectorizer:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,  # Limit features to most important ones
            min_df=2,          # Remove terms that appear in less than 2 documents
            max_df=0.9,        # Remove terms that appear in more than 90% of documents
            stop_words='english'
        )
        self.vectors: spmatrix = None
        
    def fit_transform_documents(self, processed_texts: List[str]) -> spmatrix:
        """
        Convert preprocessed texts into TF-IDF vectors
        Returns: Sparse matrix of TF-IDF features
        """
        self.vectors = self.vectorizer.fit_transform(processed_texts)
        return self.vectors
        
    def transform_single_document(self, processed_text: str) -> spmatrix:
        """Transform a single document into a TF-IDF vector"""
        return self.vectorizer.transform([processed_text])
        
    def get_feature_names(self) -> List[str]:
        """Get the list of features (words) used in vectorization"""
        return self.vectorizer.get_feature_names_out()
        
    def get_vectors(self) -> spmatrix:
        """Get the current TF-IDF matrix"""
        return self.vectors

# Global instance
document_vectorizer = DocumentVectorizer()
