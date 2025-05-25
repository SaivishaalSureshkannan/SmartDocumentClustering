from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List, Dict

class SemanticSearch:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')  # Small, fast, good quality model
        self.document_embeddings = {}  # doc_id -> embedding
        
    def embed_documents(self, documents: Dict[str, dict]):
        """
        Generate embeddings for all documents
        """
        doc_ids = []
        texts = []
        
        for doc_id, doc in documents.items():
            # Use preprocessed text if available, otherwise use extracted text
            text = doc.get('preprocessed_text') or doc.get('extracted_text')
            if text:
                doc_ids.append(doc_id)
                texts.append(text)
        
        if texts:
            # Generate embeddings for all texts at once
            embeddings = self.model.encode(texts, normalize_embeddings=True)
            
            # Store embeddings with their doc_ids
            for doc_id, embedding in zip(doc_ids, embeddings):
                self.document_embeddings[doc_id] = embedding
                
    def search(self, query: str, top_k: int = 10) -> List[dict]:
        """
        Perform semantic search
        """
        # Generate query embedding
        query_embedding = self.model.encode(query, normalize_embeddings=True)
        
        if not self.document_embeddings:
            return []
            
        # Stack all document embeddings
        doc_embeddings = np.stack(list(self.document_embeddings.values()))
        doc_ids = list(self.document_embeddings.keys())
        
        # Calculate similarities
        similarities = cosine_similarity([query_embedding], doc_embeddings)[0]
        
        # Create list of (doc_id, similarity) pairs and sort by similarity
        doc_scores = list(zip(doc_ids, similarities))
        doc_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Return top k results
        return doc_scores[:top_k]
