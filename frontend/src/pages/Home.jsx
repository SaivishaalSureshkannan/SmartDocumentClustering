import React, { useState } from 'react';
import { FiUpload, FiSearch, FiX } from 'react-icons/fi';
import '../Home.css';

const Home = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  //const [searchQuery, setSearchQuery] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (indexToRemove) => {
    setUploadedFiles(uploadedFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = () => {
    // Handle file upload logic here
    console.log('Uploading files:', uploadedFiles);
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <h1 className="title">Smart Document Clustering</h1>
    {/*}
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search through your documents..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
    */}
        <div
          className={`upload-container ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FiUpload className="upload-icon" />
          <h3 className="upload-text">
            Drag and drop your documents here
          </h3>
          <p className="upload-or">or</p>
          <label className="browse-button">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
              accept=".pdf,.doc,.docx,.txt"
            />
            Browse Files
          </label>
        </div>

        {uploadedFiles.length > 0 && (
          <div>
            <div className="files-list">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <span className="file-name">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="remove-button"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleUpload}
                className="upload-button"
                disabled={uploadedFiles.length === 0}
              >
                Upload Documents
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
