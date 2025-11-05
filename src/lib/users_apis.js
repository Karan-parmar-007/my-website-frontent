import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Get all users with pagination
export const getAllUsers = async (page = 1, size = 20) => {
  try {
    const response = await api.get('/v1/user/users', {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('getAllUsers failed', error);
    throw error;
  }
};

// Search users with pagination
export const searchUsers = async (query, page = 1, size = 20) => {
  try {
    const response = await api.get('/v1/user/search', {
      params: { q: query, page, size },
    });
    return response.data;
  } catch (error) {
    console.error('searchUsers failed', error);
    throw error;
  }
};

// Get user suggestions
export const getUserSuggestions = async (query, limit = 5) => {
  try {
    const response = await api.get('/v1/user/suggestion', {
      params: { q: query, limit },
    });
    return response.data;
  } catch (error) {
    console.error('getUserSuggestions failed', error);
    throw error;
  }
};

// Create user by admin
export const createUser = async (data) => {
  try {
    const response = await api.post('/v1/user/admin/users', data);
    return response.data;
  } catch (error) {
    console.error('createUser failed', error);
    throw error;
  }
};

// Update user by admin
export const updateUser = async (userId, data) => {
  try {
    const response = await api.put(`/v1/user/users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error('updateUser failed', error);
    throw error;
  }
};

// Delete user by admin
export const deleteUser = async (userId) => {
  try {
    await api.delete(`/v1/user/admin/users/${userId}`);
  } catch (error) {
    console.error('deleteUser failed', error);
    throw error;
  }
};