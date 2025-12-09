import api from './api';

// Get all events with filters
export const getAllEvents = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.search) params.append('search', filters.search);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    
    const response = await api.get('/api/events', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get event by ID
export const getEventById = async (id) => {
  try {
    const response = await api.get(`/api/events/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

// Create event (Promoter only)
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/api/events', eventData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update event (Promoter only)
export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/api/events/${id}`, eventData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete event (Promoter only)
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Get tickets for event
export const getEventTickets = async (eventId) => {
  try {
    const response = await api.get(`/api/events/${eventId}/tickets`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

// Add ticket to event (Promoter only)
export const addTicketToEvent = async (eventId, ticketData) => {
  try {
    const response = await api.post(`/api/events/${eventId}/tickets`, ticketData);
    return response.data.data;
  } catch (error) {
    console.error('Error adding ticket:', error);
    throw error;
  }
};
