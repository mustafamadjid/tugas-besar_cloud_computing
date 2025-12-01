import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import "../../styles/promoter/PromotorDashboard.css";

import api from "../../services/api";

import {
  FaTicketAlt,
  FaMoneyBillWave,
  FaUsers,
  FaChartBar,
  FaClipboardList,
  FaCheckCircle,
  FaUserCircle,
  FaTheaterMasks,
  FaBullhorn,
  FaEdit,
  FaTrashAlt,
  FaPlus,
} from "react-icons/fa";

import { FiMapPin, FiCalendar } from "react-icons/fi";

const EVENTS_ENDPOINT = "/api/events";

function formatDate(dateValue) {
  if (!dateValue) return "-";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return dateValue;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toDateInputValue(dateValue) {
  if (!dateValue) return "";
  if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isUpcoming(dateValue) {
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return false;
  return d >= new Date();
}

export default function PromoterDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState("");

  const [showEventForm, setShowEventForm] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [createError, setCreateError] = useState("");

  const [editingEventId, setEditingEventId] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    poster_url: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      setEventsError("");

      const res = await api.get(EVENTS_ENDPOINT);
      setEvents(res.data?.data || []);
    } catch (err) {
      setEventsError(
        err.response?.data?.message || err.message || "Gagal memuat event"
      );
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleNewEventChange = (field, value) => {
    setNewEvent((prev) => ({ ...prev, [field]: value }));
  };

  const resetNewEventForm = () => {
    setNewEvent({
      title: "",
      description: "",
      date: "",
      location: "",
      poster_url: "",
    });
    setCreateError("");
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!newEvent.title || !newEvent.date) {
      setCreateError("Judul dan tanggal wajib diisi.");
      return;
    }

    try {
      setCreatingEvent(true);

      if (editingEventId) {
        const res = await api.put(
          `${EVENTS_ENDPOINT}/${editingEventId}`,
          newEvent
        );
        const updated = res.data?.data;
        setEvents((prev) =>
          prev.map((ev) => (ev.id === updated.id ? updated : ev))
        );
      } else {
        const res = await api.post(EVENTS_ENDPOINT, newEvent);
        const created = res.data?.data;
        setEvents((prev) => [...prev, created]);
      }

      resetNewEventForm();
      setEditingEventId(null);
      setShowEventForm(false);
    } catch (err) {
      const fallbackMessage = editingEventId
        ? "Gagal mengupdate event"
        : "Gagal membuat event";
      setCreateError(
        err.response?.data?.message || err.message || fallbackMessage
      );
    } finally {
      setCreatingEvent(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus event ini?");
    if (!confirmDelete) return;

    try {
      await api.delete(`${EVENTS_ENDPOINT}/${id}`);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));

      if (editingEventId === id) {
        resetNewEventForm();
        setEditingEventId(null);
        setShowEventForm(false);
      }
    } catch (err) {
      alert(
        err.response?.data?.message || err.message || "Gagal menghapus event"
      );
    }
  };

  const handleClickNewEventButton = () => {
    if (editingEventId) {
      resetNewEventForm();
      setEditingEventId(null);
      setShowEventForm(true);
      return;
    }

    setShowEventForm((prev) => {
      const next = !prev;
      if (!next) {
        resetNewEventForm();
        setEditingEventId(null);
      }
      return next;
    });
  };

  const handleEditEvent = (event) => {
    setNewEvent({
      title: event.title || "",
      description: event.description || "",
      date: toDateInputValue(event.date),
      location: event.location || "",
      poster_url: event.poster_url || "",
    });
    setEditingEventId(event.id);
    setCreateError("");
    setShowEventForm(true);
  };

  const isEditing = Boolean(editingEventId);

  return (
    <div className="promoter-dashboard">
      <Navbar />

      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FaBullhorn /> Promotor Panel
            </h3>
          </div>

          <nav className="sidebar-menu">
            <button
              className={`menu-item ${
                activeSection === "overview" ? "active" : ""
              }`}
              onClick={() => setActiveSection("overview")}
            >
              <FaChartBar style={{ marginRight: 8 }} />
              Dashboard
            </button>

            <button
              className={`menu-item ${
                activeSection === "events" ? "active" : ""
              }`}
              onClick={() => setActiveSection("events")}
            >
              <FaClipboardList style={{ marginRight: 8 }} />
              Event Saya
            </button>

            <button
              className={`menu-item ${
                activeSection === "tickets" ? "active" : ""
              }`}
              onClick={() => setActiveSection("tickets")}
            >
              <FaTicketAlt style={{ marginRight: 8 }} />
              Manajemen Tiket
            </button>

            <button
              className={`menu-item ${
                activeSection === "sales" ? "active" : ""
              }`}
              onClick={() => setActiveSection("sales")}
            >
              <FaMoneyBillWave style={{ marginRight: 8 }} />
              Penjualan
            </button>

            <button
              className={`menu-item ${
                activeSection === "checkin" ? "active" : ""
              }`}
              onClick={() => setActiveSection("checkin")}
            >
              <FaCheckCircle style={{ marginRight: 8 }} />
              Check-in
            </button>

            <button
              className={`menu-item ${
                activeSection === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveSection("profile")}
            >
              <FaUserCircle style={{ marginRight: 8 }} />
              Profil
            </button>
          </nav>
        </aside>

        <main className="dashboard-content">
          {activeSection === "overview" && (
            <section className="section-overview">
              <h2>Dashboard Promotor</h2>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaClipboardList />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Total Event</p>
                    <h3 className="stat-value">{events.length}</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaTicketAlt />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Tiket Terjual</p>
                    <h3 className="stat-value">1,245</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaMoneyBillWave />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Pendapatan</p>
                    <h3 className="stat-value">Rp 1.2M</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaUsers />
                  </div>
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
                      <td>
                        <span className="status-completed">
                          <FaCheckCircle /> Lunas
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeSection === "events" && (
            <section className="section-events">
              <div className="section-header">
                <h2>Event Saya</h2>
                <button
                  className="btn-sm"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                  onClick={handleClickNewEventButton}
                >
                  <FaPlus />{" "}
                  {isEditing
                    ? "Buat Event Baru"
                    : showEventForm
                    ? "Tutup Form"
                    : "Buat Event"}
                </button>
              </div>

              {showEventForm && (
                <form className="event-form" onSubmit={handleSubmitEvent}>
                  <div className="form-row">
                    <label>Judul Event *</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) =>
                        handleNewEventChange("title", e.target.value)
                      }
                      placeholder="Contoh: Konser BTS"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <label>Tanggal *</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) =>
                        handleNewEventChange("date", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-row">
                    <label>Lokasi</label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) =>
                        handleNewEventChange("location", e.target.value)
                      }
                      placeholder="Contoh: Jakarta"
                    />
                  </div>

                  <div className="form-row">
                    <label>Deskripsi</label>
                    <textarea
                      rows={3}
                      value={newEvent.description}
                      onChange={(e) =>
                        handleNewEventChange("description", e.target.value)
                      }
                      placeholder="Deskripsi singkat event"
                    />
                  </div>

                  <div className="form-row">
                    <label>Poster URL</label>
                    <input
                      type="text"
                      value={newEvent.poster_url}
                      onChange={(e) =>
                        handleNewEventChange("poster_url", e.target.value)
                      }
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>

                  {createError && (
                    <p className="form-error" style={{ marginTop: 8 }}>
                      {createError}
                    </p>
                  )}

                  <div className="form-actions" style={{ marginTop: 12 }}>
                    <button
                      type="button"
                      className="btn-sm secondary"
                      onClick={() => {
                        resetNewEventForm();
                        setEditingEventId(null);
                        setShowEventForm(false);
                      }}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn-sm"
                      disabled={creatingEvent}
                    >
                      {creatingEvent
                        ? "Menyimpan..."
                        : isEditing
                        ? "Update Event"
                        : "Simpan Event"}
                    </button>
                  </div>
                </form>
              )}

              <div className="events-list" style={{ marginTop: 20 }}>
                {loadingEvents && <p className="info-text">Memuat event...</p>}

                {eventsError && !loadingEvents && (
                  <p className="error-text">{eventsError}</p>
                )}

                {!loadingEvents && !eventsError && events.length === 0 && (
                  <p className="info-text">
                    Belum ada event. Buat event pertama Anda.
                  </p>
                )}

                {!loadingEvents &&
                  !eventsError &&
                  events.map((event) => (
                    <div className="event-item" key={event.id}>
                      <div className="event-poster">
                        {event.poster_url ? (
                          <img
                            src={event.poster_url}
                            alt={event.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        ) : (
                          <FaTheaterMasks />
                        )}
                      </div>

                      <div className="event-detail">
                        <h4>{event.title}</h4>
                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <FiCalendar /> {formatDate(event.date)}
                          </span>

                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <FiMapPin /> {event.location || "-"}
                          </span>
                        </p>

                        <p className="event-status">
                          <FaCheckCircle />{" "}
                          {isUpcoming(event.date) ? "Aktif" : "Selesai"}
                        </p>
                      </div>

                      <div className="event-actions">
                        <button
                          className="btn-sm"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                          onClick={() => handleEditEvent(event)}
                        >
                          <FaEdit /> Edit
                        </button>

                        <button
                          className="btn-sm danger"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <FaTrashAlt /> Hapus
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {activeSection === "tickets" && (
            <section className="section-tickets">
              <div className="section-header">
                <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FaTicketAlt /> Manajemen Tiket
                </h2>
              </div>
              <p className="info-text">
                Kelola kategori tiket, kuota, dan harga
              </p>
            </section>
          )}

          {activeSection === "sales" && (
            <section className="section-sales">
              <div className="section-header">
                <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FaMoneyBillWave /> Laporan Penjualan
                </h2>
              </div>
              <p className="info-text">
                Lihat data pembeli, riwayat penjualan, dan export data
              </p>
            </section>
          )}

          {activeSection === "checkin" && (
            <section className="section-checkin">
              <div className="section-header">
                <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FaCheckCircle /> Check-in Tiket
                </h2>
              </div>
              <p className="info-text">
                Scan QR Code untuk validasi tiket masuk event
              </p>
            </section>
          )}

          {activeSection === "profile" && (
            <section className="section-profile">
              <div className="section-header">
                <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FaUserCircle /> Profil Promotor
                </h2>
              </div>
              <p className="info-text">
                Kelola informasi profil dan brand event Anda
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
