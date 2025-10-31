import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  withCredentials: true,
});

export const usersApi = {
  // Get all users with pagination
  getAllUsers: async (page = 1, size = 20) => {
    const response = await api.get('/user/users', {
      params: { page, size },
    });
    return response.data;
  },

  // Search users with pagination
  searchUsers: async (query, page = 1, size = 20) => {
    const response = await api.get('/user/search', {
      params: { q: query, page, size },
    });
    return response.data;
  },

  // Get user suggestions
  getUserSuggestions: async (query, limit = 5) => {
    const response = await api.get('/user/suggestion', {
      params: { q: query, limit },
    });
    return response.data;
  },

  // Create user by admin
  createUser: async (data) => {
    const response = await api.post('/user/admin/users', data);
    return response.data;
  },

  // Update user by admin
  updateUser: async (userId, data) => {
    const response = await api.put(`/user/users/${userId}`, data);
    return response.data;
  },

  // Delete user by admin
  deleteUser: async (userId) => {
    await api.delete(`/user/admin/users/${userId}`);
  },
};