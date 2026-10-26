import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onOpenAuthModal, onOpenInfoModal }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAccessPortalClick = () => {
    setMobileMenuOpen(false);
    if (user) {
      const role = (user.role || '').toLowerCase();
      if (role === 'caretaker') navigate('/caretaker/dashboard');
      else if (role === 'warden') navigate('/warden/dashboard');
      else navigate('/student/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="main-header">
      <div className="container navbar-container">
        {/* Brand Logo & College Title */}
        <Link to="/" className="brand-link" onClick={() => setMobileMenuOpen(false)}>
          <img
            src="/assets/kec-logo.jpg"
            alt="Kongu Engineering College Logo"
            className="brand-logo-img"
          />
          <div className="brand-titles">
            <div className="brand-college-name">
              KONGU <span>ENGINEERING COLLEGE</span>
            </div>
            <div className="brand-system-name">KEC Hostels – Hostel Management System</div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`} id="primary-nav-menu">
            <li>
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="#our-hostels"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('our-hostels');
                }}
              >
                Our Hostels
              </a>
            </li>
            <li>
              <a
                href="#information"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  onOpenInfoModal('general');
                }}
              >
                Information
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('contact');
                }}
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#portal"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleAccessPortalClick();
                }}
              >
                Access Portal
              </a>
            </li>
          </ul>
        </nav>

        {/* Auth Profile Menu / Sign In CTA */}
        <div className="nav-auth-actions" id="nav-auth-actions">
          {user ? (
            <div className="user-profile-menu">
              <button
                className="user-pill-btn"
                onClick={() => {
                  const role = (user.role || '').toLowerCase();
                  if (role === 'caretaker') navigate('/caretaker/dashboard');
                  else if (role === 'warden') navigate('/warden/dashboard');
                  else navigate('/student/dashboard');
                }}
                title="Open your hostel dashboard"
              >
                <span className="user-avatar-dot"></span>
                <span className="user-nav-name">
                  {user.name} ({user.role.toUpperCase()})
                </span>
                <span className="portal-tag">Portal &rarr;</span>
              </button>
              <button
                className="btn btn-outline-danger btn-sm nav-logout-btn"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-menu-toggle"
          id="mobile-toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
