import React, { useState } from 'react';
import '../styles/EventFilter.css';

export default function EventFilter({ onFilter, category = 'Event' }) {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    genre: '',
    category: category,
    dateFrom: '',
    dateTo: '',
    priceMin: 0,
    priceMax: 1000000,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { 
      ...filters, 
      [name]: parseInt(value)
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      search: '',
      location: '',
      genre: '',
      dateFrom: '',
      dateTo: '',
      priceMin: 0,
      priceMax: 1000000,
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <div className="event-filter">
      <div className="filter-header">
        <h3>Filter Event</h3>
        <button className="reset-btn" onClick={handleReset}>Reset</button>
      </div>

      {/* Search */}
      <div className="filter-group">
        <label>Cari Event / Artis</label>
        <input 
          type="text"
          name="search"
          value={filters.search}
          onChange={handleInputChange}
          placeholder="Nama event, artis..."
          className="filter-input"
        />
      </div>

      {/* Location */}
      <div className="filter-group">
        <label>Lokasi</label>
        <select 
          name="location"
          value={filters.location}
          onChange={handleInputChange}
          className="filter-select"
        >
          <option value="">Semua Lokasi</option>
          <option value="jakarta">Jakarta</option>
          <option value="surabaya">Surabaya</option>
          <option value="bandung">Bandung</option>
          <option value="medan">Medan</option>
          <option value="yogyakarta">Yogyakarta</option>
        </select>
      </div>

      {/* Date Range */}
      <div className="filter-group">
        <label>Dari Tanggal</label>
        <input 
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleInputChange}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>Sampai Tanggal</label>
        <input 
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleInputChange}
          className="filter-input"
        />
      </div>

      {/* Genre */}
      <div className="filter-group">
        <label>Genre Event</label>
        <select 
          name="genre"
          value={filters.genre}
          onChange={handleInputChange}
          className="filter-select"
        >
          <option value="">Semua Genre</option>
          <option value="konser">🎵 Konser Musik</option>
          <option value="festival">🎪 Festival</option>
          <option value="workshop">👨‍🏫 Workshop</option>
          <option value="olahraga">⚽ Olahraga</option>
          <option value="teater">🎭 Teater</option>
          <option value="stand-up">🎤 Stand-up Comedy</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <label>Harga Minimum</label>
        <input 
          type="number"
          name="priceMin"
          value={filters.priceMin}
          onChange={handlePriceChange}
          placeholder="Rp 0"
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>Harga Maksimal</label>
        <input 
          type="number"
          name="priceMax"
          value={filters.priceMax}
          onChange={handlePriceChange}
          placeholder="Rp 1.000.000"
          className="filter-input"
        />
        <p className="price-display">
          Rp {filters.priceMin.toLocaleString('id-ID')} - Rp {filters.priceMax.toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
}
