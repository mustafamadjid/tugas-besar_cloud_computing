import React, { useState, useEffect } from 'react';
import '../styles/EventCarousel.css';

export default function EventCarousel({ events = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length]);

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  if (events.length === 0) return null;

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {/* Slides */}
        <div className="carousel-slides">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className="slide-background">
                {event.poster_url ? (
                  <img src={event.poster_url} alt={event.title} />
                ) : (
                  <div className="slide-placeholder">No Image</div>
                )}
                <div className="slide-overlay"></div>
              </div>

              <div className="slide-content">
                <h2 className="slide-title">{event.title}</h2>
                <p className="slide-date">
                  {new Date(event.date).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                {event.location && (
                  <p className="slide-location">📍 {event.location}</p>
                )}
                <button className="slide-btn">Lihat Sekarang →</button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button className="carousel-btn prev" onClick={handlePrevious}>
          ‹
        </button>
        <button className="carousel-btn next" onClick={handleNext}>
          ›
        </button>

        {/* Dots */}
        <div className="carousel-dots">
          {events.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}
