import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../../services/userService';
import Navbar from '../../components/Navbar';
import '../../styles/buyer/Profile.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data || {
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  }, [user?.name, user?.email]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    if (role !== 'BUYER') {
      navigate('/dashboard');
      return;
    }

    fetchProfile();
  }, [isAuthenticated, role, navigate, fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setMessage('');

      // Validasi email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profile.email)) {
        setError('Email tidak valid');
        setLoading(false);
        return;
      }

      // Validasi nomor telepon
      if (profile.phone && !/^\d{10,}$/.test(profile.phone.replace(/\D/g, ''))) {
        setError('Nomor telepon harus minimal 10 digit');
        setLoading(false);
        return;
      }

      await updateUserProfile(profile);
      setMessage('Profil berhasil diperbarui!');
      setIsEditing(false);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.name) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="loading-container">
          <p>Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-container">
        <div className="profile-header">
          <h1>Profil Saya</h1>
          <p>Kelola informasi akun Anda</p>
        </div>

        <div className="profile-content">
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h2>Informasi Pribadi</h2>

              <div className="form-group">
                <label htmlFor="name">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="Masukkan email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Nomor Telepon</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="Masukkan nomor telepon (contoh: 081234567890)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Alamat</label>
                <textarea
                  id="address"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="form-input textarea"
                  placeholder="Masukkan alamat lengkap"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              {!isEditing ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profil
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile(); // Reset form
                    }}
                  >
                    Batal
                  </button>
                </>
              )}
            </div>
          </form>

          <div className="profile-actions">
            <button 
              className="action-btn"
              onClick={() => navigate('/my-tickets')}
            >
              📋 Lihat Tiket Saya
            </button>
            <button 
              className="action-btn"
              onClick={() => navigate('/events')}
            >
              🎫 Cari Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
