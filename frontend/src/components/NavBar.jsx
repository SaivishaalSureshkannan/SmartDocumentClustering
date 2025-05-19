import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          SmartDocSearch
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Upload
          </Link>
          <Link 
            to="/clusters" 
            className={`nav-link ${location.pathname === "/clusters" ? "active" : ""}`}
          >
            Clusters
          </Link>
          <Link 
            to="/search" 
            className={`nav-link ${location.pathname === "/search" ? "active" : ""}`}
          >
            Search
          </Link>
          <Link 
            to="/visualize" 
            className={`nav-link ${location.pathname === "/visualize" ? "active" : ""}`}
          >
            Visualize
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
