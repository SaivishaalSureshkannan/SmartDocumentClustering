import React, { useState, useEffect } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import '../styles/ClusterExplore.css';

const ClusterExplore = () => {
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [kValue, setKValue] = useState(4);
  const [clusters, setClusters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null); // New state for document preview

  // Fetch cluster data
  const fetchClusterData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch cluster contents
      const response = await fetch('http://localhost:8000/cluster-contents');
      if (!response.ok) throw new Error('Failed to fetch clusters');
      const clusterData = await response.json();
      setClusters(clusterData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching clusters:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchClusterData();
  }, []);

  // Handle re-clustering with new k value
  const handleReCluster = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Trigger re-clustering
      const response = await fetch(`http://localhost:8000/cluster?num_clusters=${kValue}`, {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Clustering failed');
      
      // Fetch updated cluster data
      await fetchClusterData();
    } catch (err) {
      setError(err.message);
      console.error('Error during clustering:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClusterClick = (clusterId) => {
    setSelectedCluster(clusterId === selectedCluster ? null : clusterId);
  };

  const handleKValueChange = (e) => {
    const value = Math.max(2, Math.min(10, Number(e.target.value)));
    setKValue(value);
  };

  // Handler for document preview
  const handlePreviewClick = (doc) => {
    setPreviewDoc(previewDoc === doc ? null : doc);
  };
  // Handler for document deletion
  const handleDeleteClick = async (clusterId, docIndex, doc) => {
    try {
      if (!doc.doc_id) {
        throw new Error('Document ID not found');
      }
      
      const response = await fetch(`http://localhost:8000/document/${doc.doc_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete document');
      }

      // Refresh the cluster data after successful deletion
      await fetchClusterData();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting document:', err);
    }
  };

  if (loading) return <div className="loading">Processing clusters...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="cluster-explore">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="cluster-list">
          {Object.entries(clusters).map(([clusterId, documents]) => (
            <div
              key={clusterId}
              className={`cluster-item ${selectedCluster === clusterId ? 'selected' : ''}`}
              onClick={() => handleClusterClick(clusterId)}
            >
              Cluster {parseInt(clusterId) + 1} ({documents.length} docs)
            </div>
          ))}
        </div>

        <div className="recluster-section">
          <div className="recluster-input">
            <label>Re-Cluster ( K = </label>
            <input 
              type="number" 
              value={kValue}
              onChange={handleKValueChange}
              min="2"
              max="10"
            />
            <label> )</label>
          </div>
          <button 
            className="change-button" 
            onClick={handleReCluster}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Change'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {(selectedCluster ? 
          [[selectedCluster, clusters[selectedCluster]]] : 
          Object.entries(clusters)
        ).map(([clusterId, documents]) => (
          <div key={clusterId} className="cluster-section">
            <h2>Cluster {parseInt(clusterId) + 1}:</h2>
            <div className="documents-grid">
              {documents.map((doc, index) => (
                <div key={index} className="document-card">
                  <div className="doc-content">
                    <h3>{doc.filename}</h3>
                    <p>{previewDoc === doc ? doc.extracted_text : 
                        `${doc.extracted_text.substring(0, 100)}...`}</p>
                  </div>
                  <div className="doc-actions">
                    <button 
                      className="icon-button"
                      onClick={() => handlePreviewClick(doc)}
                      title="Preview"
                    >
                      <FiEye />
                    </button>
                    <button 
                      className="icon-button delete"
                      onClick={() => handleDeleteClick(clusterId, index, doc)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClusterExplore;