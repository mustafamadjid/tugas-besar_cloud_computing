import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleSignInBuyer, googleSignInPromoter } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function AuthSelector() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('BUYER'); // BUYER or PROMOTER

  const handleBuyerLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const userData = await googleSignInBuyer();
      loginUser(userData, userData.role);
      navigate('/events');
    } catch (err) {
      setError('Login gagal. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoterLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const userData = await googleSignInPromoter();
      loginUser(userData, userData.role);
      navigate('/dashboard');
    } catch (err) {
      setError('Login gagal. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (userType === 'BUYER') {
      await handleBuyerLogin();
    } else {
      await handlePromoterLogin();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🎫</span>
          <h1>KOMA</h1>
        </div>
        <p className="subtitle">Platform Pembelian Tiket Event Terpercaya</p>

        {/* Toggle Switch */}
        <div className="user-type-toggle">
          <button
            className={`toggle-btn left ${userType === 'BUYER' ? 'active' : ''}`}
            onClick={() => setUserType('BUYER')}
          >
            👥 Penonton
          </button>
          <button
            className={`toggle-btn right ${userType === 'PROMOTER' ? 'active' : ''}`}
            onClick={() => setUserType('PROMOTER')}
          >
            🎪 Promotor
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Dynamic Content Based on User Type */}
        <div className="auth-content">
          {userType === 'BUYER' ? (
            <>
              <p className="content-desc">Sebagai Penonton</p>
              <p className="content-subtitle">Jelajahi dan beli tiket event favorit Anda</p>
            </>
          ) : (
            <>
              <p className="content-desc">Sebagai Promotor</p>
              <p className="content-subtitle">Kelola event dan tiket Anda dengan mudah</p>
            </>
          )}
        </div>

        {/* Login and Register Buttons */}
        <div className="auth-buttons">
          <button 
            className="auth-btn login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Loading...' : '🔑 Masuk dengan Google'}
          </button>
          <button 
            className="auth-btn register-btn"
            onClick={() => handleLogin()}
            disabled={loading}
          >
            {loading ? 'Loading...' : '✏️ Daftar dengan Google'}
          </button>
        </div>

        <p className="info-text">
          Gunakan akun Google untuk masuk atau mendaftar
        </p>

        <div className="auth-footer">
          <p>Dengan masuk, Anda menyetujui <a href="#terms">Syarat & Ketentuan</a> dan <a href="#privacy">Kebijakan Privasi</a> kami</p>
        </div>
      </div>
    </div>
  );
}
