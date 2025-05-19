import React, { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import '../styles/ClusterExplore.css';

const ClusterExplore = () => {
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [kValue, setKValue] = useState(3);

  // Placeholder data
  const clusters = [
    {
      id: 1,
      name: "Cluster 1",
      documentCount: 5,
      documents: [
        { id: 1, title: "Doc A" },
        { id: 2, title: "Doc B" },
        { id: 3, title: "Doc C" },
        { id: 4, title: "Doc D" },
        { id: 5, title: "Doc E" },
      ]
    },
    {
      id: 2,
      name: "Cluster 2",
      documentCount: 5,
      documents: [
        { id: 6, title: "Doc F" },
        { id: 7, title: "Doc G" },
        { id: 8, title: "Doc H" },
        { id: 9, title: "Doc I" },
        { id: 10, title: "Doc J" },
      ]
    },
    {
      id: 3,
      name: "Cluster 3",
      documentCount: 5,
      documents: [
        { id: 11, title: "Doc K" },
        { id: 12, title: "Doc L" },
        { id: 13, title: "Doc M" },
        { id: 14, title: "Doc N" },
        { id: 15, title: "Doc O" },
      ]
    }
  ];

  const handleClusterClick = (clusterId) => {
    setSelectedCluster(clusterId === selectedCluster ? null : clusterId);
  };

  const handleViewDocument = (docId) => {
    console.log('Viewing document:', docId);
    // This will be implemented later when document viewing is added
  };

  const handleReCluster = () => {
    console.log('Re-clustering with k value:', kValue);
    // This will be implemented later when backend is connected
  };

  const handleKValueChange = (e) => {
    const value = Math.max(2, Math.min(10, Number(e.target.value)));
    setKValue(value);
  };

  return (
    <div className="cluster-explore">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="cluster-list">
          {clusters.map(cluster => (
            <div
              key={cluster.id}
              className={`cluster-item ${selectedCluster === cluster.id ? 'selected' : ''}`}
              onClick={() => handleClusterClick(cluster.id)}
            >
              {cluster.name} ({cluster.documentCount} docs)
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
            <label> ):</label>
          </div>
          <button className="change-button" onClick={handleReCluster}>
            Change
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {(selectedCluster ? 
          clusters.filter(c => c.id === selectedCluster) : 
          clusters
        ).map(cluster => (
          <div key={cluster.id} className="cluster-section">
            <h2>{cluster.name}:</h2>
            <div className="documents-grid">
              {cluster.documents.map(doc => (
                <div key={doc.id} className="document-card">
                  <span className="doc-title">- {doc.title}</span>
                  <button 
                    className="view-button"
                    onClick={() => handleViewDocument(doc.id)}
                    title="View document"
                  >
                    <FiEye />
                  </button>
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