import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-content">
        <div className="logo">
          <span className="logo-icon">❤️</span>
          <span className="logo-text">SeniorGuard<span className="highlight">AI</span></span>
        </div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#solution">Solution</a></li>
          <li><a href="#how-it-works">How it Works</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/login')} className="btn btn-outline btn-sm">Login</button>
          <button onClick={() => navigate('/signup')} className="btn btn-primary btn-sm">Sign Up</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
