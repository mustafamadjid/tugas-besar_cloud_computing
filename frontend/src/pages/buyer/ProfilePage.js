import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile } from "../../services/userService";
import Navbar from "../../components/Navbar";
import "../../styles/buyer/Profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, role, updateAuthUser } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Ambil data langsung dari user (localStorage lewat AuthContext)
  const fetchProfile = useCallback(() => {
    try {
      setLoading(true);
      setError("");

      if (user) {
        setProfile({
          name: user.name || "",
          email: user.email || "",
        });
      } else {
        setError("User tidak ditemukan");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    if (role !== "BUYER") {
      navigate("/dashboard");
      return;
    }

    fetchProfile();
  }, [isAuthenticated, role, navigate, fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setMessage("");

      // Validasi email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profile.email)) {
        setError("Email tidak valid");
        setLoading(false);
        return;
      }

      // Kirim hanya field yang memang ada: name & email
      const updatedUser = await updateUserProfile({
        name: profile.name,
        email: profile.email,
      });

      // Update context authentication
      updateAuthUser(updatedUser);

      setMessage("Profil berhasil diperbarui!");
      setIsEditing(false);

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.name && !profile.email) {
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

          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h2>Informasi Akun</h2>

                <div className="form-group">
                  <label htmlFor="name">Nama Lengkap</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
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
                    className="form-input"
                    placeholder="Masukkan email"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setProfile({
                      name: user.name || "",
                      email: user.email || "",
                    });
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-view">
              <div className="form-section">
                <h2>Informasi Akun</h2>

                <div className="form-group readonly-info">
                  <label>Nama Lengkap</label>
                  <div className="readonly-value">{profile.name}</div>
                </div>

                <div className="form-group readonly-info">
                  <label>Email</label>
                  <div className="readonly-value">{profile.email}</div>
                </div>

                {user?.created_at && (
                  <div className="form-group readonly-info">
                    <label>Dibuat Pada</label>
                    <div className="readonly-value">
                      {new Date(user.created_at).toLocaleString("id-ID")}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setIsEditing(true);
                    console.log("isEditing state set to true");
                  }}
                >
                  Edit Profil
                </button>
              </div>
            </div>
          )}

          <div className="profile-actions">
            <button
              className="action-btn"
              onClick={() => navigate("/my-tickets")}
            >
              📋 Lihat Tiket Saya
            </button>
            <button className="action-btn" onClick={() => navigate("/events")}>
              🎫 Cari Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
