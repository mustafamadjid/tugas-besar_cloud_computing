import api from './api';

// Create order
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/api/orders', orderData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get user orders
export const getUserOrders = async () => {
  try {
    const response = await api.get('/api/buyer/tickets');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Get order items
export const getOrderItems = async (orderId) => {
  try {
    const response = await api.get(`/api/orders/${orderId}/items`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching order items:', error);
    throw error;
  }
};

// Update order status (Promoter)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/api/orders/${orderId}`, { payment_status: status });
    return response.data.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Get event orders (Promoter only)
export const getEventOrders = async (eventId) => {
  try {
    const response = await api.get(`/api/events/${eventId}/orders`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching event orders:', error);
    throw error;
  }
};

// Check in ticket
export const checkInTicket = async (orderId, itemId) => {
  try {
    const response = await api.post(`/api/orders/${orderId}/checkin`, { item_id: itemId });
    return response.data.data;
  } catch (error) {
    console.error('Error checking in ticket:', error);
    throw error;
  }
};
