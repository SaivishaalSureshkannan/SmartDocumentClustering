import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import { FiSearch, FiEye } from 'react-icons/fi';
import '../styles/Search.css';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);    const handleSearch = async (e) => {
        e.preventDefault(); 
        if (!searchQuery.trim()) return; // Prevent empty searches

        setIsSearching(true);
        try {
            const response = await fetch('http://localhost:8000/semantic-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchQuery)
            });

            const data = await response.json();
            if (data.results) {
                // Map the results to match our component's expected format
                const formattedResults = data.results.map((result) => ({
                    id: result.doc_id,
                    title: result.filename,
                    excerpt: result.snippet,
                    relevance: Math.round(result.similarity * 100) // Convert to percentage
                }));
                setSearchResults(formattedResults);
            }
        } catch (error) {
            console.error('Search error:', error);
            // You could set an error state here
        } finally {
            setIsSearching(false);
        }
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

