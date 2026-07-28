import api from './api';

export const authService = {
  // Login user and obtain JWT token
  login: async (email, password) => {
    const response = await api.post('/user/login', { email, password });
    return response.data;
  },

  // Register a new user
  register: async (userData) => {
    const response = await api.post('/user', userData);
    return response.data;
  },

  // Update password for logged-in user
  updatePassword: async (currentPassword, password) => {
    const response = await api.patch('/user/updateMyPassword', { currentPassword, password });
    return response.data;
  }
};
