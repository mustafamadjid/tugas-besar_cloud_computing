import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleSignInBuyer } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

export default function BuyerLoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const userData = await googleSignInBuyer();
      loginUser(userData, userData.role);
      navigate('/profile'); // Redirect to profile page after successful buyer login
    } catch (err) {
      setError('Login gagal. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🎫</span>
          <h1>Login Penonton</h1>
        </div>
        <p className="subtitle">Jelajahi dan beli tiket event favorit Anda.</p>
        
        {error && <div className="error-message">{error}</div>}

        <div className="auth-buttons">
          <button 
            className="auth-btn login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Loading...' : '🔑 Masuk dengan Google'}
          </button>
        </div>

        <p className="info-text">
          Gunakan akun Google untuk masuk atau mendaftar sebagai penonton.
        </p>

        <div className="auth-footer">
          <p>Dengan masuk, Anda menyetujui <a href="#terms">Syarat & Ketentuan</a> dan <a href="#privacy">Kebijakan Privasi</a> kami.</p>
        </div>
      </div>
    </div>
  );
}