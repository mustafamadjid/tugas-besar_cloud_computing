import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../services/eventService';
import Navbar from '../components/Navbar';
import '../styles/EventsPage.css';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      setError('Gagal memuat events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="events-page">

      <main className="events-main">
        <div className="events-header">
          <h1>Semua Event</h1>
          <p>Temukan event favorit Anda</p>
        </div>

        {loading && <div className="loading">Memuat events...</div>}
        
        {error && <div className="error">{error}</div>}
        
        {!loading && events.length === 0 && (
          <div className="no-events">Belum ada event tersedia</div>
        )}
        
        {!loading && events.length > 0 && (
          <div className="events-grid">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="event-card"
                onClick={() => handleEventClick(event.id)}
              >
                {event.poster_url && (
                  <img 
                    src={event.poster_url} 
                    alt={event.title}
                    className="event-poster"
                  />
                )}
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p className="event-date">
                    📅 {new Date(event.date).toLocaleDateString('id-ID')}
                  </p>
                  {event.location && (
                    <p className="event-location">📍 {event.location}</p>
                  )}
                  <button className="detail-btn">Lihat Detail</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
