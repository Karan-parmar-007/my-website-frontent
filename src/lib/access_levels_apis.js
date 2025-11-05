import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;  // This will be "https://karanparmar.in/api" at build time

const api = axios.create({
  baseURL: apiUrl,  // Sets base to https://karanparmar.in/api
  withCredentials: true,
});

// Get all access levels
export const getAllAccessLevels = async () => {
  try {
    const response = await api.get('/v1/project/access-levels');
    return response.data;
  } catch (error) {
    console.error('getAllAccessLevels failed', error);
    throw error;
  }
};

// Get single access level by ID
export const getAccessLevel = async (accessLevelId) => {
  try {
    const response = await api.get(`/v1/project/access-levels/${accessLevelId}`);
    return response.data;
  } catch (error) {
    console.error('getAccessLevel failed', error);
    throw error;
  }
};

// Create access level
export const createAccessLevel = async (data) => {
  try {
    const response = await api.post('/v1/project/access-levels', data);
    return response.data;
  } catch (error) {
    console.error('createAccessLevel failed', error);
    throw error;
  }
};

// Update access level
export const updateAccessLevel = async (accessLevelId, data) => {
  try {
    const response = await api.put(`/v1/project/access-levels/${accessLevelId}`, data);
    return response.data;
  } catch (error) {
    console.error('updateAccessLevel failed', error);
    throw error;
  }
};

// Delete access level
export const deleteAccessLevel = async (accessLevelId) => {
  try {
    await api.delete(`/v1/project/access-levels/${accessLevelId}`);
  } catch (error) {
    console.error('deleteAccessLevel failed', error);
    throw error;
  }
};