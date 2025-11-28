import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logoutUser, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Event');

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setMobileMenuOpen(false);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const isBuyer = role === 'BUYER';

  return (
    <nav className="navbar-modern">
      <div className="navbar-container">
        {/* Left: Logo & Tabs */}
        <div className="navbar-left">
          <div className="navbar-brand" onClick={() => handleNavClick('/')}>
            <span className="brand-icon">🎫</span>
            <span className="brand-name">KOMA</span>
          </div>

          <div className="navbar-tabs">
            <button 
              className={`tab-item ${activeTab === 'Event' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('Event');
                handleNavClick('/events');
              }}
            >
              Event
            </button>
            <button 
              className={`tab-item ${activeTab === 'Atraksi' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('Atraksi');
                handleNavClick('/atraksi');
              }}
            >
              Atraksi
            </button>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="navbar-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Cari event dan atraksi di sini ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">🔍</button>
          </form>
        </div>

        {/* Right: Cart & Auth */}
        <div className="navbar-right">
          <button className="cart-btn">
            🛒
            <span className="cart-badge">0</span>
          </button>

          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-name">{user?.name || user?.email}</span>
                <button 
                  className="profile-btn"
                  onClick={() => handleNavClick(isBuyer ? '/profile' : '/dashboard')}
                >
                  {isBuyer ? 'Profil' : 'Dashboard'}
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="login-btn"
              onClick={() => handleNavClick('/login')}
            >
              Masuk
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <div className="mobile-menu-content">
            <form onSubmit={handleSearch} className="mobile-search">
              <input
                type="text"
                placeholder="Cari event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">🔍</button>
            </form>

            <div className="mobile-nav-links">
              <button onClick={() => handleNavClick('/')}>Beranda</button>
              {isAuthenticated && isBuyer && (
                <>
                  <button onClick={() => handleNavClick('/events')}>Jelajahi Event</button>
                  <button onClick={() => handleNavClick('/my-tickets')}>Tiket Saya</button>
                </>
              )}
               {isAuthenticated && !isBuyer && (
                <>
                  <button onClick={() => handleNavClick('/dashboard')}>Dashboard</button>
                  <button onClick={() => handleNavClick('/manage-events')}>Kelola Event</button>
                </>
              )}
            </div>

            {isAuthenticated ? (
               <button className="mobile-logout" onClick={handleLogout}>
                Logout ({user?.name || user?.email})
              </button>
            ) : (
              <button className="mobile-login" onClick={() => handleNavClick('/login')}>
                Masuk / Daftar
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

