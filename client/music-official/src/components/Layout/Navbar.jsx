import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaHome, 
  FaSearch, 
  FaMusic, 
  FaUpload, 
  FaUser, 
  FaCog, 
  FaSignOutAlt, 
  FaBars 
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/search', icon: FaSearch, label: 'Search' },
    { path: '/library', icon: FaMusic, label: 'Library' },
    { path: '/upload', icon: FaUpload, label: 'Upload' },
  ];

  // Add profile and settings for logged-in users
  const userNavItems = user ? [
    { path: '/profile', icon: FaUser, label: 'Profile' },
    { path: '/settings', icon: FaCog, label: 'Settings' },
  ] : [];

  const allNavItems = [...navItems, ...userNavItems];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setIsMobileMenuOpen(false)}>
          <FaMusic className="brand-icon" />
          <span>RebaMmino</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Section */}
        <div className="navbar-user">
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="username">Hello, {user.username}</span>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt />
                <span className="logout-text">Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Login
              </Link>
              <Link to="/register" className="register-button">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          {user ? (
            <>
              <div className="mobile-user-info">
                <FaUser />
                <span>Hello, {user.username}</span>
              </div>
              <button onClick={handleLogout} className="mobile-logout-button">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="mobile-auth-buttons">
              <Link 
                to="/login" 
                className="mobile-login-button"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="mobile-register-button"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;