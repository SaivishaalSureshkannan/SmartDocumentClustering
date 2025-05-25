import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import { FiSearch, FiEye } from 'react-icons/fi';
import '../styles/Search.css';

const Search = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResults([]); // Clear previous results

        try {
            const response = await fetch('http://localhost:8000/semantic-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    top_k: 10
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || errorData.message || 'Search failed');
            }

            const data = await response.json();
            
            // Validate response format
            if (!data.results || !Array.isArray(data.results)) {
                throw new Error('Invalid response format from server');
            }
            
            setResults(data.results);
            
            // Clear error if successful
            setError(null);
        } catch (err) {
            console.error('Search error:', err);
            setError(err.message || 'Failed to perform search. Please try again.');
            setResults([]); // Clear results on error
        } finally {
            setLoading(false);
        }
    };

    const formatSimilarity = (score) => {
        return (score * 100).toFixed(1) + '%';
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
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search documents (e.g., 'financial summary')..."
                            className="search-input"
                        />
                    </div>
                    <button type="submit" className="search-button">
                        Search
                    </button>
                </form>

                {query && !error && (
                    <div className="search-results-header">
                        Showing results for: {query}
                    </div>
                )}

                {loading ? (
                    <div className="loading-indicator">
                        Searching documents...
                    </div>
                ) : error ? (
                    <div className="error-message">
                        {error}
                    </div>
                ) : (
                    <div className="search-results">
                        {results.length > 0 ? (
                            results.map((result) => (
                                <div key={result.doc_id} className="result-card">
                                    <div className="result-header">
                                        <h3 className="result-title">{result.filename}</h3>
                                        <span className="relevance-score">
                                            ⭐ {formatSimilarity(result.similarity)}
                                        </span>
                                    </div>
                                    <p className="result-excerpt">{result.snippet}</p>
                                    <button className="view-button">
                                        <FiEye /> View
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                {query ? 
                                    "No documents matched your query. Try a broader search." :
                                    "Start typing to search through your documents."
                                }
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;

