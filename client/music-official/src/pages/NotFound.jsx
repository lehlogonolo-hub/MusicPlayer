import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaMusic, FaExclamationTriangle } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-container">
        <div className="not-found-icon">
          <FaExclamationTriangle />
        </div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
        
        <div className="not-found-actions">
          <Link to="/" className="action-btn primary">
            <FaHome />
            Go Home
          </Link>
          <Link to="/search" className="action-btn secondary">
            <FaSearch />
            Browse Music
          </Link>
          <Link to="/library" className="action-btn secondary">
            <FaMusic />
            Your Library
          </Link>
        </div>

        <div className="not-found-suggestions">
          <h3>You might be looking for:</h3>
          <ul>
            <li><Link to="/">Homepage</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/library">Your Library</Link></li>
            <li><Link to="/upload">Upload Music</Link></li>
            <li><Link to="/profile">Your Profile</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;