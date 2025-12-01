import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserOrders } from '../../services/orderService';
import Navbar from '../../components/Navbar';
import '../../styles/buyer/MyTickets.css';

export default function MyTicketsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // active, used, cancelled
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders();
      setOrders(data || []);
    } catch (err) {
      setError('Gagal memuat tiket');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    if (activeTab === 'active') {
      return orders.filter(o => o.payment_status === 'COMPLETED');
    } else if (activeTab === 'used') {
      return orders.filter(o => o.checked_in === true);
    } else if (activeTab === 'cancelled') {
      return orders.filter(o => o.payment_status === 'CANCELLED');
    }
    return orders;
  };

  const getStatusBadge = (status) => {
    if (status === 'PENDING') return <span className="badge pending">⏳ Menunggu</span>;
    if (status === 'COMPLETED') return <span className="badge completed">✓ Aktif</span>;
    if (status === 'FAILED') return <span className="badge failed">✗ Gagal</span>;
    if (status === 'CANCELLED') return <span className="badge cancelled">✗ Batal</span>;
    return <span className="badge">{status}</span>;
  };

  const handleViewTicket = (orderId) => {
    navigate(`/ticket/${orderId}`);
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="my-tickets-page">
      <Navbar />

      <div className="tickets-container">
        <div className="tickets-header">
          <h1>🎫 Tiket Saya</h1>
          <p>Kelola tiket konser Anda</p>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            📅 Tiket Aktif
          </button>
          <button 
            className={`tab-btn ${activeTab === 'used' ? 'active' : ''}`}
            onClick={() => setActiveTab('used')}
          >
            ✓ Sudah Digunakan
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            ✗ Dibatalkan
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Memuat tiket...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="no-tickets">
            <p>😅 Belum ada tiket {activeTab === 'active' ? 'aktif' : 'di kategori ini'}</p>
            <button 
              className="btn-browse"
              onClick={() => navigate('/events')}
            >
              Cari Event
            </button>
          </div>
        ) : (
          <div className="tickets-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="ticket-card">
                <div className="ticket-left">
                  <div className="ticket-icon">🎟️</div>
                  <div className="ticket-info">
                    <h3 className="ticket-event">
                      Event #{order.id}
                    </h3>
                    <p className="ticket-date">
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="ticket-count">
                      {order.items?.length || 1} tiket
                    </p>
                  </div>
                </div>

                <div className="ticket-middle">
                  <p className="price">
                    Rp {order.total_price?.toLocaleString('id-ID')}
                  </p>
                  {getStatusBadge(order.payment_status)}
                </div>

                <div className="ticket-right">
                  <button 
                    className="btn-view"
                    onClick={() => handleViewTicket(order.id)}
                  >
                    Lihat Tiket
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
