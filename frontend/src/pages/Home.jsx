import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FiUpload, FiSearch, FiX } from 'react-icons/fi';
import NavBar from '../components/NavBar';
import ClusterExplore from './ClusterExplore';
import Search from './Search';
import '../styles/Home.css';

const UploadPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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
    // Navigate to clusters page after upload
    navigate('/clusters');
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="search-container">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search through your documents..."
            className="search-bar w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FiUpload className="upload-icon" />
          <h3 className="text-lg font-medium text-gray-200 mb-2">
            Drag and drop your documents here
          </h3>
          <p className="text-gray-400 mb-4">or</p>
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
          <div className="uploaded-files">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Uploaded Files</h3>
            <div className="files-list">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <span className="text-gray-300">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="remove-button"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
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

const Home = () => {
  return (
    <div className="app">
      <NavBar />
      <Routes>
        <Route path="/" element={<UploadPage />} />        <Route path="/clusters" element={<ClusterExplore />} />
        <Route path="/search" element={<Search />} />
        <Route path="/visualize" element={<div className="coming-soon">Visualize Page (Coming Soon)</div>} />
      </Routes>
    </div>
  );
};

export default Home;
