import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import { FiSearch, FiEye } from 'react-icons/fi';
import '../styles/Search.css';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault(); 
        if (!searchQuery.trim()) return; // Prevent empty searches

        setIsSearching(true);

        setTimeout(() => {
            setSearchResults([
        {
          id: 1,
          title: 'financial_summary.pdf',
          excerpt: 'profit increased by 23% in Q3',
          relevance: 90
        },
        {
          id: 2,
          title: 'q3_overview_notes.docx',
          excerpt: 'the third quarter closed strongly',
          relevance: 88
        }
      ]);
      setIsSearching(false);
    }, 1000);
  };

return (
    <div className="search-page">
      <NavBar />
      
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents (e.g., 'financial summary Q3 2023')..."
              className="search-input"
            />
          </div>
                    <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {searchQuery && (
          <div className="search-results-header">
            Showing results for: {searchQuery}
          </div>
        )}

        {isSearching ? (
          <div className="loading-indicator">
            Searching documents...
          </div>
        ) : (
          <div className="search-results">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <div key={result.id} className="result-card">
                  <div className="result-header">
                    <h3 className="result-title">{result.title}</h3>
                    <span className="relevance-score">⭐ {result.relevance}%</span>
                  </div>
                  <p className="result-excerpt">{result.excerpt}</p>
                  <button className="view-button">
                    <FiEye /> View
                  </button>
                </div>
              ))
            ) : (
                <div className="empty-state">
                {searchQuery ? (
                  "No documents matched your query. Try a broader search."
                ) : (
                  "Start typing to search through your documents."
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

