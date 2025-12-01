import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../services/eventService';
import Navbar from '../components/Navbar';
import EventCarousel from '../components/EventCarousel';
import '../styles/LandingPage.css';

export default function LandingPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="landing-page">
      <Navbar/>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Temukan Event Terbaik Untuk Anda</h1>
          <p className="hero-subtitle">
            Pesan tiket untuk konser, festival, workshop, dan acara seru lainnya
          </p>
          <button 
            className="cta-button"
            onClick={() => navigate('/events')}
          >
            Jelajahi Event
          </button>
        </div>
        <div className="hero-background"></div>
      </section>

      {/* Carousel Section - Featured Events */}
      {!loading && events.length > 0 && (
        <EventCarousel events={events.slice(0, 5)} />
      )}

      {/* Featured Events Section */}
      <section className="featured-section">
        <div className="section-container">
          <h2 className="section-title">Event Terpopuler</h2>
          <p className="section-subtitle">Event dengan rating terbaik dari pengunjung</p>

          {loading ? (
            <div className="loading">Memuat event...</div>
          ) : events.length === 0 ? (
            <div className="no-events">Belum ada event tersedia</div>
          ) : (
            <div className="events-slider">
              {events.slice(0, 6).map((event) => (
                <div 
                  key={event.id} 
                  className="event-card featured"
                  onClick={() => handleEventClick(event.id)}
                >
                  <div className="event-image">
                    {event.poster_url ? (
                      <img 
                        src={event.poster_url} 
                        alt={event.title}
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                    <div className="event-badge">Promo</div>
                  </div>
                  <div className="event-details">
                    <h3>{event.title}</h3>
                    <div className="event-meta">
                      <span className="date">
                        📅 {new Date(event.date).toLocaleDateString('id-ID')}
                      </span>
                      {event.location && (
                        <span className="location">📍 {event.location}</span>
                      )}
                    </div>
                    <p className="description">
                      {event.description?.substring(0, 100)}...
                    </p>
                    <button className="detail-btn">Lihat Detail</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-container stats-grid">
          <div className="stat-item">
            <h3 className="stat-number">{events.length}+</h3>
            <p className="stat-label">Event Tersedia</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">10K+</h3>
            <p className="stat-label">Pembeli Puas</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">100%</h3>
            <p className="stat-label">Terjamin Asli</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Tentang KOMA</h4>
            <p>Platform terpercaya untuk pembelian tiket event favorit Anda. Nikmati pengalaman booking yang mudah dan aman.</p>
          </div>
          <div className="footer-section">
            <h4>Kategori Event</h4>
            <ul>
              <li><a href="#concert">Konser Musik</a></li>
              <li><a href="#festival">Festival</a></li>
              <li><a href="#workshop">Workshop</a></li>
              <li><a href="#sport">Olahraga</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Bantuan & Layanan</h4>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Hubungi Kami</a></li>
              <li><a href="#terms">Syarat & Ketentuan</a></li>
              <li><a href="#privacy">Kebijakan Privasi</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Ikuti Kami</h4>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">📘 Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📷 Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">𝕏 Twitter</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 KOMA Event Ticketing. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
