import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleSignInPromoter } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

export default function PromoterLoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const userData = await googleSignInPromoter();
      loginUser(userData, userData.role);
      navigate('/dashboard'); // Redirect to dashboard after successful promoter login
    } catch (err) {
      const statusCode = err.response?.status;
      const msg = err.response?.data?.message || err.message || 'Login Gagal. Silakan coba lagi.';

      if (statusCode === 400) {
        setError(msg);
      }
      if (statusCode === 401) {
        setError(msg);
      }
      if(statusCode === 403) {
        setError("Anda belum terdaftar sebagai promotor.");
      }
      
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🎪</span>
          <h1>Login Promotor</h1>
        </div>
        <p className="subtitle">Kelola event dan tiket Anda dengan mudah.</p>
        
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
          Gunakan akun Google untuk masuk atau mendaftar sebagai promotor.
        </p>

        <div className="auth-footer">
          <p>Dengan masuk, Anda menyetujui <a href="#terms">Syarat & Ketentuan</a> dan <a href="#privacy">Kebijakan Privasi</a> kami.</p>
        </div>
      </div>
    </div>
  );
}