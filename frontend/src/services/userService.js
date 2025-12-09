import api from './api';

// Get current user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/buyer/profile');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/api/buyer/profile', profileData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
