import axios from 'axios';

const API_URL = window.env?.VITE_API_URL || import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/v1`,
  withCredentials: true,
});

export const accessLevelsApi = {
  // Get all access levels
  getAllAccessLevels: async () => {
    const response = await api.get('/project/access-levels');
    return response.data;
  },

  // Get single access level by ID
  getAccessLevel: async (accessLevelId) => {
    const response = await api.get(`/project/access-levels/${accessLevelId}`);
    return response.data;
  },

  // Create access level
  createAccessLevel: async (data) => {
    const response = await api.post('/project/access-levels', data);
    return response.data;
  },

  // Update access level
  updateAccessLevel: async (accessLevelId, data) => {
    const response = await api.put(`/project/access-levels/${accessLevelId}`, data);
    return response.data;
  },

  // Delete access level
  deleteAccessLevel: async (accessLevelId) => {
    await api.delete(`/project/access-levels/${accessLevelId}`);
  },
};