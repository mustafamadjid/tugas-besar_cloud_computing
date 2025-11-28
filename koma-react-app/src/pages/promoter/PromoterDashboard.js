import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import '../../styles/promoter/PromotorDashboard.css';

export default function PromoterDashboard() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="promoter-dashboard">
      <Navbar />

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <h3>🎪 Promotor Panel</h3>
          </div>

          <nav className="sidebar-menu">
            <button 
              className={`menu-item ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`menu-item ${activeSection === 'events' ? 'active' : ''}`}
              onClick={() => setActiveSection('events')}
            >
              🎫 Event Saya
            </button>
            <button 
              className={`menu-item ${activeSection === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveSection('tickets')}
            >
              🎟️ Manajemen Tiket
            </button>
            <button 
              className={`menu-item ${activeSection === 'sales' ? 'active' : ''}`}
              onClick={() => setActiveSection('sales')}
            >
              💰 Penjualan
            </button>
            <button 
              className={`menu-item ${activeSection === 'checkin' ? 'active' : ''}`}
              onClick={() => setActiveSection('checkin')}
            >
              ✅ Check-in
            </button>
            <button 
              className={`menu-item ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              👤 Profil
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          {/* Overview */}
          {activeSection === 'overview' && (
            <section className="section-overview">
              <h2>Dashboard Promotor</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🎫</div>
                  <div className="stat-content">
                    <p className="stat-label">Total Event</p>
                    <h3 className="stat-value">8</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🎟️</div>
                  <div className="stat-content">
                    <p className="stat-label">Tiket Terjual</p>
                    <h3 className="stat-value">1,245</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <p className="stat-label">Pendapatan</p>
                    <h3 className="stat-value">Rp 1.2M</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <p className="stat-label">Total Pembeli</p>
                    <h3 className="stat-value">892</h3>
                  </div>
                </div>
              </div>

              <div className="recent-sales">
                <h3>Penjualan Terbaru</h3>
                <table className="sales-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Pembeli</th>
                      <th>Jumlah</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Konser BTS</td>
                      <td>John Doe</td>
                      <td>2 tiket</td>
                      <td>Rp 400.000</td>
                      <td><span className="status-completed">✓ Lunas</span></td>
                    </tr>
                    <tr>
                      <td>Festival Musik 2025</td>
                      <td>Jane Smith</td>
                      <td>1 tiket</td>
                      <td>Rp 250.000</td>
                      <td><span className="status-completed">✓ Lunas</span></td>
                    </tr>
                    <tr>
                      <td>Stand Up Comedy</td>
                      <td>Alex Johnson</td>
                      <td>3 tiket</td>
                      <td>Rp 450.000</td>
                      <td><span className="status-pending">⏳ Pending</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Events Management */}
          {activeSection === 'events' && (
            <section className="section-events">
              <div className="section-header">
                <h2>Event Saya</h2>
                <button className="btn-primary">+ Buat Event</button>
              </div>

              <div className="events-list">
                <div className="event-item">
                  <div className="event-poster">🎭</div>
                  <div className="event-detail">
                    <h4>Konser BTS</h4>
                    <p>📅 25 Dec 2024 | 📍 Jakarta</p>
                    <p className="event-status">✓ Aktif</p>
                  </div>
                  <div className="event-actions">
                    <button className="btn-sm">Edit</button>
                    <button className="btn-sm danger">Hapus</button>
                  </div>
                </div>

                <div className="event-item">
                  <div className="event-poster">🎪</div>
                  <div className="event-detail">
                    <h4>Festival Musik 2025</h4>
                    <p>📅 10 Jan 2025 | 📍 Bandung</p>
                    <p className="event-status">✓ Aktif</p>
                  </div>
                  <div className="event-actions">
                    <button className="btn-sm">Edit</button>
                    <button className="btn-sm danger">Hapus</button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Ticket Management */}
          {activeSection === 'tickets' && (
            <section className="section-tickets">
              <div className="section-header">
                <h2>Manajemen Tiket</h2>
              </div>
              <p className="info-text">Kelola kategori tiket, kuota, dan harga</p>
              {/* Form akan ditambahkan */}
            </section>
          )}

          {/* Sales Report */}
          {activeSection === 'sales' && (
            <section className="section-sales">
              <div className="section-header">
                <h2>Laporan Penjualan</h2>
              </div>
              <p className="info-text">Lihat data pembeli, riwayat penjualan, dan export data</p>
              {/* Report akan ditambahkan */}
            </section>
          )}

          {/* Check-in */}
          {activeSection === 'checkin' && (
            <section className="section-checkin">
              <div className="section-header">
                <h2>Check-in Tiket</h2>
              </div>
              <p className="info-text">Scan QR Code untuk validasi tiket masuk event</p>
              {/* Check-in form akan ditambahkan */}
            </section>
          )}

          {/* Profile */}
          {activeSection === 'profile' && (
            <section className="section-profile">
              <div className="section-header">
                <h2>Profil Promotor</h2>
              </div>
              <p className="info-text">Kelola informasi profil dan brand event Anda</p>
              {/* Profile form akan ditambahkan */}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
