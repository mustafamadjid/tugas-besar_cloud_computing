import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "../../styles/buyer/Checkout.css";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const isBuyer = role === "BUYER";

  const state = location.state || {};
  const { event, items = [], subtotal = 0, adminFee = 0, total = 0 } = state;

  const [paymentMethod, setPaymentMethod] = useState("TRANSFER_BANK");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Guard akses
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isBuyer) {
      navigate("/dashboard");
      return;
    }

    if (!event || !items.length || total <= 0) {
      navigate("/events");
      return;
    }
  }, [isAuthenticated, isBuyer, navigate, event, items.length, total]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!items.length || total <= 0) {
      setError("Tidak ada tiket yang dipilih.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      // Susun payload sesuai skema orders + order_items
      const payload = {
        total_price: total,
        payment_method: paymentMethod,
        items: items.map((item) => ({
          event_id: event.id,
          ticket_type: item.type,
          ticket_price: item.price,
          quantity: item.quantity,
        })),
      };

      const res = await api.post("/api/buyer/order", payload);
      const createdOrder = res.data?.data;

      setSuccessMessage(
        "Order berhasil dibuat! Anda akan diarahkan ke tiket saya."
      );
      // Setelah beberapa detik arahkan ke halaman tiket
      setTimeout(() => {
        navigate("/my-tickets", {
          state: {
            orderId: createdOrder?.id,
          },
        });
      }, 2000);
    } catch (err) {
      console.error("Error creating order:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Gagal membuat order. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event || !items.length) {
    // fallback kalau langsung akses /checkout tanpa state
    return (
      <div className="checkout-page">
        <Navbar />
        <div className="checkout-container">
          <div className="checkout-card">
            <h1>Checkout</h1>
            <p>
              Tidak ada data pesanan. Silakan pilih event dan tiket terlebih
              dahulu.
            </p>
            <button className="btn-primary" onClick={() => navigate("/events")}>
              Kembali ke Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const eventDateString = eventDate.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const eventTimeString = eventDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="checkout-page">
      <Navbar />

      <div className="checkout-container">
        <div className="checkout-layout">
          {/* Kiri: Ringkasan Event & Item */}
          <div className="checkout-main">
            <div className="checkout-card">
              <h1 className="checkout-title">Konfirmasi Pesanan</h1>
              <p className="checkout-subtitle">
                Periksa kembali detail pesanan Anda sebelum melakukan
                pembayaran.
              </p>

              {/* Event Info */}
              <div className="event-summary">
                <h2>Event</h2>
                <div className="event-summary-content">
                  {event.poster_url && (
                    <img
                      src={event.poster_url}
                      alt={event.title}
                      className="event-summary-poster"
                    />
                  )}
                  <div className="event-summary-info">
                    <h3>{event.title}</h3>
                    <p>{eventDateString}</p>
                    <p>{eventTimeString}</p>
                    {event.location && (
                      <p className="event-location">📍 {event.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ticket Items */}
              <div className="items-section">
                <h2>Tiket yang Dibeli</h2>
                <div className="items-list">
                  {items.map((item) => (
                    <div
                      key={item.ticketId || item.ticket_id || item.type}
                      className="item-row"
                    >
                      <div className="item-info">
                        <p className="item-type">{item.type}</p>
                        <p className="item-qty">
                          {item.quantity} x Rp{" "}
                          {Number(item.price).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="item-subtotal">
                        Rp{" "}
                        {Number(
                          item.subtotal ?? item.price * item.quantity
                        ).toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Kanan: Pembayaran */}
          <div className="checkout-sidebar">
            <form className="checkout-card" onSubmit={handleCreateOrder}>
              <h2>Ringkasan Pembayaran</h2>

              {/* Breakdown Harga */}
              <div className="price-box">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>Rp {Number(subtotal).toLocaleString("id-ID")}</span>
                </div>
                <div className="price-row">
                  <span>Biaya Admin</span>
                  <span>Rp {Number(adminFee).toLocaleString("id-ID")}</span>
                </div>
                <div className="price-row total">
                  <span>Total Pembayaran</span>
                  <span>Rp {Number(total).toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Metode Pembayaran */}
              <div className="payment-method-section">
                <h3>Metode Pembayaran</h3>
                <div className="payment-options">
                  <label
                    className={`payment-option ${
                      paymentMethod === "TRANSFER_BANK" ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="TRANSFER_BANK"
                      checked={paymentMethod === "TRANSFER_BANK"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-content">
                      <span className="payment-title">Transfer Bank</span>
                      <span className="payment-desc">
                        Transfer manual ke rekening yang akan kami tampilkan.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`payment-option ${
                      paymentMethod === "EWALLET" ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="EWALLET"
                      checked={paymentMethod === "EWALLET"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-content">
                      <span className="payment-title">E-Wallet</span>
                      <span className="payment-desc">
                        DANA, OVO, GoPay, dan lainnya.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {error && <div className="checkout-error">{error}</div>}
              {successMessage && (
                <div className="checkout-success">{successMessage}</div>
              )}

              <button
                type="submit"
                className="btn-primary btn-full"
                disabled={isSubmitting || !items.length || total <= 0}
              >
                {isSubmitting ? "Memproses..." : "Bayar Sekarang"}
              </button>

              <button
                type="button"
                className="btn-secondary btn-full"
                onClick={() =>
                  navigate(`/events/${event.id}`, {
                    state: { fromCheckout: true },
                  })
                }
              >
                Kembali ke Detail Event
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
