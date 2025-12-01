import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllEvents } from '../services/eventService';
import EventFilter from '../components/EventFilter';
import Navbar from '../components/Navbar';
import '../styles/buyer/BrowseEvents.css';

export default function AtraksiPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      // Filter only for "Atraksi" category if applicable
      const atraksiEvents = data.filter(e => e.category === 'Atraksi' || !e.category); // Simple filter logic
      setEvents(atraksiEvents || []);
      setFilteredEvents(atraksiEvents || []);
    } catch (err) {
      setError('Gagal memuat atraksi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters) => {
    applyFilters(events, newFilters);
  };

  const applyFilters = (eventList, newFilters) => {
    let result = [...eventList];

    // Filter by search (event name, artist, or promoter)
    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase();
      result = result.filter(e => 
        e.title?.toLowerCase().includes(searchLower) ||
        e.description?.toLowerCase().includes(searchLower) ||
        e.artist?.toLowerCase().includes(searchLower) ||
        e.organizer?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by location
    if (newFilters.location) {
      result = result.filter(e => 
        e.location?.toLowerCase().includes(newFilters.location.toLowerCase())
      );
    }

    // Filter by genre
    if (newFilters.genre) {
      result = result.filter(e => 
        e.genre?.toLowerCase().includes(newFilters.genre.toLowerCase())
      );
    }

    // Filter by date range
    if (newFilters.dateFrom) {
      result = result.filter(e => new Date(e.date) >= new Date(newFilters.dateFrom));
    }
    if (newFilters.dateTo) {
      result = result.filter(e => new Date(e.date) <= new Date(newFilters.dateTo));
    }

    // Filter by price range
    if (newFilters.priceMin !== undefined) {
      result = result.filter(e => {
        const minPrice = e.tickets?.[0]?.price || 0;
        return minPrice >= newFilters.priceMin;
      });
    }
    if (newFilters.priceMax !== undefined) {
      result = result.filter(e => {
        const minPrice = e.tickets?.[0]?.price || 0;
        return minPrice <= newFilters.priceMax;
      });
    }

    setFilteredEvents(result);
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="browse-events-page">

      <div className="browse-container">
        {/* Sidebar Filter */}
        <aside className="filter-sidebar">
          <EventFilter onFilter={handleFilter} />
        </aside>

        {/* Main Content */}
        <main className="events-content">
          <div className="content-header">
            <h1>Jelajah & Cari Atraksi</h1>
            <p>Lihat daftar atraksi, filter berdasarkan tanggal, lokasi, genre, harga, dan cari berdasarkan nama, atau tipe.</p>
            <p>{filteredEvents.length} atraksi ditemukan</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Memuat atraksi...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="no-results">
              <p>❌ Tidak ada atraksi yang sesuai dengan filter Anda</p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <div 
                  key={event.id}
                  className="event-card-browse"
                  onClick={() => handleEventClick(event.id)}
                >
                  <div className="event-image-wrapper">
                    {event.poster_url ? (
                      <img 
                        src={event.poster_url} 
                        alt={event.title}
                        className="event-image"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>

                  <div className="event-card-content">
                    <h3 className="event-title">{event.title}</h3>
                    
                    <div className="event-meta">
                      <span className="meta-date">
                        📅 {new Date(event.date).toLocaleDateString('id-ID')}
                      </span>
                      {event.location && (
                        <span className="meta-location">
                          📍 {event.location}
                        </span>
                      )}
                    </div>

                    <p className="event-description">
                      {event.description?.substring(0, 80)}...
                    </p>

                    <button className="btn-view-detail">
                      Lihat Detail →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
