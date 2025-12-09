import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../../services/orderService";
import Navbar from "../../components/Navbar";
import "../../styles/buyer/MyTickets.css";

export default function MyTicketsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // active, used, cancelled
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUserOrders();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat tiket");
    } finally {
      setLoading(false);
    }
  };

  const isOrderHasUsedTickets = (order) =>
    order.items?.some((item) => item.checked_in) ?? false;

  const isOrderHasActiveTickets = (order) =>
    order.payment_status === "COMPLETED" &&
    (order.items?.some((item) => !item.checked_in) ?? false);

  const getFilteredOrders = () => {
    if (activeTab === "active") {
      // order dengan pembayaran sukses dan masih ada tiket yang belum dipakai
      return orders.filter(isOrderHasActiveTickets);
    } else if (activeTab === "used") {
      // minimal ada 1 tiket checked_in
      return orders.filter(isOrderHasUsedTickets);
    } else if (activeTab === "cancelled") {
      return orders.filter((o) => o.payment_status === "CANCELLED");
    }
    return orders;
  };

  const getStatusBadge = (order) => {
    const status = order.payment_status;

    if (status === "PENDING")
      return <span className="badge pending">⏳ Menunggu</span>;
    if (status === "COMPLETED" && isOrderHasUsedTickets(order))
      return <span className="badge used">✓ Sebagian / Sudah Digunakan</span>;
    if (status === "COMPLETED")
      return <span className="badge completed">✓ Aktif</span>;
    if (status === "FAILED")
      return <span className="badge failed">✗ Gagal</span>;
    if (status === "CANCELLED")
      return <span className="badge cancelled">✗ Batal</span>;
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
            className={`tab-btn ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            📅 Tiket Aktif
          </button>
          <button
            className={`tab-btn ${activeTab === "used" ? "active" : ""}`}
            onClick={() => setActiveTab("used")}
          >
            ✓ Sudah Digunakan
          </button>
          <button
            className={`tab-btn ${activeTab === "cancelled" ? "active" : ""}`}
            onClick={() => setActiveTab("cancelled")}
          >
            ✗ Dibatalkan
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Memuat tiket...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="no-tickets">
            <p>
              😅 Belum ada tiket{" "}
              {activeTab === "active" ? "aktif" : "di kategori ini"}
            </p>
            <button className="btn-browse" onClick={() => navigate("/events")}>
              Cari Event
            </button>
          </div>
        ) : (
          <div className="tickets-list">
            {filteredOrders.map((order) => {
              const firstItem = order.items?.[0];
              const eventTitle = firstItem?.event_title || `Order #${order.id}`;
              const eventDate = firstItem?.event_date
                ? new Date(firstItem.event_date)
                : null;

              const dateLabel = eventDate
                ? eventDate.toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : new Date(order.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

              const totalTickets =
                order.items?.reduce(
                  (sum, item) => sum + (item.quantity || 0),
                  0
                ) ?? 0;

              const totalPriceNumber = Number(order.total_price) || 0;

              return (
                <div key={order.id} className="ticket-card">
                  <div className="ticket-left">
                    <div className="ticket-icon">🎟️</div>
                    <div className="ticket-info">
                      <h3 className="ticket-event">{eventTitle}</h3>
                      <p className="ticket-date">{dateLabel}</p>
                      {firstItem?.event_location && (
                        <p className="ticket-location">
                          {firstItem.event_location}
                        </p>
                      )}
                      <p className="ticket-count">
                        {totalTickets} tiket •{" "}
                        {order.items
                          .map((i) => `${i.ticket_type} x${i.quantity || 0}`)
                          .join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="ticket-middle">
                    <p className="price">
                      Rp {totalPriceNumber.toLocaleString("id-ID")}
                    </p>
                    {getStatusBadge(order)}
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
