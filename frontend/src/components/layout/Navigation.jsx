import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    typeof document !== 'undefined'
      ? (localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
      : 'light'
  );
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/landing', label: 'Landing', icon: '🚀' },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="nav-logo">
            <div className="logo-icon">📈</div>
            <span className="logo-text">PixelTracker</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'nav-link--active' : ''}`}
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span className="nav-link-text">{item.label}</span>
            </Link>
          ))}
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle color theme">
            <span>{theme === 'light' ? '🌞' : '🌜'}</span>
            <span className="text-sm">{theme === 'light' ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'mobile-menu-btn--open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu-content">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link ${isActive(item.path) ? 'mobile-nav-link--active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mobile-nav-link-icon">{item.icon}</span>
              <span className="mobile-nav-link-text">{item.label}</span>
            </Link>
          ))}
          <button className="theme-toggle" onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}>
            <span>{theme === 'light' ? '🌞' : '🌜'}</span>
            <span className="text-sm">{theme === 'light' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navigation;