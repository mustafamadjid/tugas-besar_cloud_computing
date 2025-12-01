import React from "react";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

// React Icons
import { FaUsers, FaBullhorn } from "react-icons/fa";

export default function AuthSelectionPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon" aria-hidden="true">
          </span>
          <h1>GOTIKETKU</h1>
        </div>

        <p className="subtitle">Pilih tipe akun Anda untuk masuk.</p>

        <div
          className="auth-buttons"
          style={{ flexDirection: "column", gap: "1rem" }}
        >
          <Link
            to="/login/buyer"
            className="auth-btn login-btn"
            style={{
              width: "100%",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <FaUsers />
            Masuk sebagai Penonton
          </Link>

          <Link
            to="/login/promoter"
            className="auth-btn login-btn"
            style={{
              width: "100%",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <FaBullhorn />
            Masuk sebagai Promotor
          </Link>
        </div>

        <div className="auth-footer">
          <p>
            Dengan masuk, Anda menyetujui{" "}
            <a href="#terms">Syarat & Ketentuan</a> dan{" "}
            <a href="#privacy">Kebijakan Privasi</a> kami
          </p>
        </div>
      </div>
    </div>
  );
}
