import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
});

// Get featured projects
const getFeaturedProjects = async () => {
  try {
    const response = await api.get('/v1/project/projects/featured');
    return response.data;
  } catch (error) {
    console.error('getFeaturedProjects failed', error);
    throw error;
  }
};

// Get latest projects
const getLatestProjects = async () => {
  try {
    const response = await api.get('/v1/project/projects/latest');
    return response.data;
  } catch (error) {
    console.error('getLatestProjects failed', error);
    throw error;
  }
};

// Get all projects with pagination
const getAllProjects = async (page = 1, size = 12) => {
  try {
    const response = await api.get('/v1/project/projects', {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('getAllProjects failed', error);
    throw error;
  }
};

// Search projects
const searchProjects = async (query, page = 1, size = 12) => {
  try {
    const response = await api.get('/v1/project/projects/search', {
      params: { q: query, page, size },
    });
    return response.data;
  } catch (error) {
    console.error('searchProjects failed', error);
    throw error;
  }
};

// Get project suggestions
const getProjectSuggestions = async (query, limit = 5) => {
  try {
    const response = await api.get('/v1/project/projects/suggestion', {
      params: { q: query, limit },
    });
    return response.data;
  } catch (error) {
    console.error('getProjectSuggestions failed', error);
    throw error;
  }
};

export const publicProjectsApi = {
  getFeaturedProjects,
  getLatestProjects,
  getAllProjects,
  searchProjects,
  getProjectSuggestions,
};