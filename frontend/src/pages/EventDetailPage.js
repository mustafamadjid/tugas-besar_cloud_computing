import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, getEventTickets } from "../services/eventService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/EventDetail.css";

const ADMIN_FEE = 5000;

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // cek role seperti di Navbar
  const { isAuthenticated, role } = useAuth();
  const isBuyer = role === "BUYER";

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ticketId -> quantity
  const [selectedTickets, setSelectedTickets] = useState({});
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    fetchEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const eventData = await getEventById(id);
      setEvent(eventData);

      try {
        const ticketData = await getEventTickets(id);
        setTickets(ticketData || []);
      } catch (err) {
        console.log("Tickets not found or not available");
        setTickets([]);
      }

      // reset selection ketika pindah event
      setSelectedTickets({});
      setSubtotal(0);
    } catch (err) {
      setError("Event tidak ditemukan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Hitung ulang subtotal setiap selectedTickets / tickets berubah
  useEffect(() => {
    let total = 0;

    Object.entries(selectedTickets).forEach(([ticketId, qty]) => {
      const ticket = tickets.find((t) => String(t.id) === String(ticketId));
      if (!ticket) return;

      const price = Number(ticket.price) || 0;
      const quantity = Number(qty) || 0;

      if (quantity > 0) {
        total += price * quantity;
      }
    });

    setSubtotal(total);
  }, [selectedTickets, tickets]);

  const handleTicketQuantityChange = (ticketId, quantity) => {
    const parsed = Number(quantity);
    const safeQty = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);

    setSelectedTickets((prev) => {
      const next = { ...prev };
      if (safeQty > 0) {
        next[ticketId] = safeQty;
      } else {
        delete next[ticketId];
      }
      return next;
    });
  };

  const handleBuyTickets = () => {
    if (!isAuthenticated) {
      // pola sama dengan Navbar: arahkan ke login/landing
      navigate("/login");
      return;
    }

    if (!isBuyer) {
      alert("Akun ini tidak memiliki role pembeli.");
      return;
    }

    if (subtotal <= 0) {
      alert("Pilih minimal satu tiket.");
      return;
    }

    // susun detail item tiket untuk checkout
    const items = Object.entries(selectedTickets)
      .map(([ticketId, qty]) => {
        const ticket = tickets.find((t) => String(t.id) === String(ticketId));
        if (!ticket) return null;

        const price = Number(ticket.price) || 0;
        const quantity = Number(qty) || 0;
        const lineTotal = price * quantity;

        return {
          ticketId: ticket.id,
          type: ticket.type,
          price,
          quantity,
          subtotal: lineTotal,
        };
      })
      .filter(Boolean);

    const adminFee = subtotal > 0 ? ADMIN_FEE : 0;
    const total = subtotal + adminFee;

    // Redirect ke halaman checkout dengan data lengkap
    navigate("/checkout", {
      state: {
        eventId: id,
        event,
        items,
        subtotal,
        adminFee,
        total,
      },
    });
  };

  if (loading) {
    return (
      <div className="event-detail-page">
        <Navbar />
        <div className="loading">Memuat detail event...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-detail-page">
        <Navbar />
        <div className="error">{error || "Event tidak ditemukan"}</div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const eventTime = eventDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const adminFee = subtotal > 0 ? ADMIN_FEE : 0;
  const totalPrice = subtotal + adminFee;

  return (
    <div className="event-detail-page">
      <Navbar />

      <div className="event-detail-container">
        {/* Poster Section */}
        <div className="poster-section">
          {event.poster_url ? (
            <img
              src={event.poster_url}
              alt={event.title}
              className="event-poster"
            />
          ) : (
            <div className="no-poster">No Image Available</div>
          )}
        </div>

        {/* Main Content */}
        <div className="detail-content">
          {/* Left Column - Event Info */}
          <div className="info-column">
            <h1 className="event-title">{event.title}</h1>

            {/* Event Meta Info */}
            <div className="meta-info">
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <div>
                  <p className="meta-label">Tanggal</p>
                  <p className="meta-value">
                    {eventDate.toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="meta-item">
                <span className="meta-icon">🕐</span>
                <div>
                  <p className="meta-label">Waktu</p>
                  <p className="meta-value">{eventTime}</p>
                </div>
              </div>

              {event.location && (
                <div className="meta-item">
                  <span className="meta-icon">📍</span>
                  <div>
                    <p className="meta-label">Lokasi</p>
                    <p className="meta-value">{event.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="description-section">
              <h2>Tentang Event</h2>
              <p className="description-text">
                {event.description || "Tidak ada deskripsi untuk event ini."}
              </p>
            </div>

            {/* Event Details */}
            <div className="details-section">
              <h2>Informasi Event</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <h4>Status</h4>
                  <p className="status-active">Tersedia</p>
                </div>
                <div className="detail-item">
                  <h4>Kategori</h4>
                  <p>Hiburan / Acara</p>
                </div>
                <div className="detail-item">
                  <h4>Organizer</h4>
                  <p>KOMA Events</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Tickets */}
          <div className="pricing-column">
            <div className="pricing-card">
              <h2 className="pricing-title">Pilih Tiket</h2>

              {tickets.length === 0 ? (
                <div className="no-tickets">
                  <p>Tiket belum tersedia untuk event ini</p>
                </div>
              ) : (
                <div className="tickets-list">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="ticket-item">
                      <div className="ticket-info">
                        <h3>{ticket.type}</h3>
                        <p className="ticket-price">
                          Rp {Number(ticket.price).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="ticket-quantity">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleTicketQuantityChange(
                              ticket.id,
                              (selectedTickets[ticket.id] || 0) - 1
                            )
                          }
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={selectedTickets[ticket.id] || 0}
                          onChange={(e) =>
                            handleTicketQuantityChange(
                              ticket.id,
                              e.target.value
                            )
                          }
                          className="qty-input"
                        />
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleTicketQuantityChange(
                              ticket.id,
                              (selectedTickets[ticket.id] || 0) + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Summary */}
              {tickets.length > 0 && (
                <div className="price-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="summary-row">
                    <span>Biaya Admin</span>
                    <span>Rp {adminFee.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="btn-secondary" onClick={() => navigate("/")}>
                  Kembali
                </button>
                <button
                  className={`btn-primary ${
                    !isBuyer || subtotal <= 0 || tickets.length === 0
                      ? "disabled"
                      : ""
                  }`}
                  onClick={handleBuyTickets}
                  disabled={!isBuyer || subtotal <= 0 || tickets.length === 0}
                >
                  {!isAuthenticated
                    ? "Login untuk Membeli"
                    : !isBuyer
                    ? "Akun bukan pembeli"
                    : subtotal <= 0
                    ? "Pilih tiket dulu"
                    : "Lanjut ke Pembayaran"}
                </button>
              </div>
            </div>

            {/* Promo Banner */}
            <div className="promo-banner">
              <h4>🎉 Dapatkan Diskon</h4>
              <p>
                Beli tiket sekarang dan dapatkan kesempatan memenangkan hadiah
                menarik!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
