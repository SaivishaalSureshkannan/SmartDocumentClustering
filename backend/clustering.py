from sklearn.cluster import KMeans
from sklearn.preprocessing import normalize
from scipy.sparse import spmatrix
import numpy as np
import joblib
from pathlib import Path

class DocumentClusterer:
    def __init__(self):
        self.model = None
        self.model_path = Path(__file__).parent / "models" / "kmeans_model.joblib"
        # Create models directory if it doesn't exist
        self.model_path.parent.mkdir(exist_ok=True)
        
    def cluster_documents(self, doc_vectors: spmatrix, num_clusters: int = 4) -> tuple[np.ndarray, KMeans]:
        """
        Cluster document vectors using K-means with enhanced parameters
        """
        self.model = KMeans(
            n_clusters=num_clusters,
            random_state=42,
            n_init='auto',     # Changed to auto for better initialization
            max_iter=2000,     # Increased for better convergence
            tol=1e-8,         # Tighter tolerance
            init='k-means++'   # Better initialization strategy
        )
        # Normalize the vectors before clustering
        normalized_vectors = normalize(doc_vectors, norm='l2', axis=1)
        labels = self.model.fit_predict(normalized_vectors)
        
        # Save the trained model
        joblib.dump(self.model, self.model_path)
        
        return labels, self.model
    
    def predict_cluster(self, doc_vector: spmatrix) -> int:
        """Predict cluster for a new document vector"""
        if self.model is None:
            try:
                self.model = joblib.load(self.model_path)
            except FileNotFoundError:
                raise ValueError("No trained clustering model found")
        
        return self.model.predict(doc_vector)[0]

# Global instance
document_clusterer = DocumentClusterer()
