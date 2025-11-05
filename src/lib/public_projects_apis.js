import axios from 'axios';

const API_URL = window.env?.VITE_API_URL || import.meta.env.VITE_API_URL;


const api = axios.create({
  baseURL: `${API_URL}/v1`,
});

export const publicProjectsApi = {
  // Get featured projects (top 4)
  getFeaturedProjects: async () => {
    const response = await api.get('/project/projects/featured');
    return response.data;
  },

  // Get latest non-interesting projects (top 6)
  getLatestProjects: async () => {
    const response = await api.get('/project/projects/latest');
    return response.data;
  },

  // Get all projects with pagination
  getAllProjects: async (page = 1, size = 12) => {
    const response = await api.get('/project/projects', {
      params: { page, size },
    });
    return response.data;
  },

  // Search projects
  searchProjects: async (query, page = 1, size = 12) => {
    const response = await api.get('/project/projects/search', {
      params: { q: query, page, size },
    });
    return response.data;
  },

  // Get project suggestions
  getProjectSuggestions: async (query, limit = 5) => {
    const response = await api.get('/project/projects/suggestion', {
      params: { q: query, limit },
    });
    return response.data;
  },
};