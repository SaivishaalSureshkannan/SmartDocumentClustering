import React from 'react';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from '../components/NavBar';
import '../styles/DocumentViewer.css';

export default function DocumentViewer() {
  const { docId } = useParams();
  const [content, setContent] = useState("");
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const response = await fetch(`http://localhost:8000/document/${docId}`);
        if (!response.ok) throw new Error("Failed to fetch document.");
        const data = await response.json();
        setContent(data.content);
        setFilename(data.filename);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [docId]);

  return (
    <div className="document-viewer">
      <NavBar />
      <div className="document-container">
        {loading ? (
          <p className="loading-message">Loading document...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="document-content">
            <h2 className="document-title">{filename}</h2>
            <pre className="document-text">
              {content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
