import axios from 'axios';

const API_URL = window.env?.VITE_API_URL || import.meta.env.VITE_API_URL;


const api = axios.create({
  baseURL: `${API_URL}/v1`,
  withCredentials: true,
});

export const projectsApi = {
  // Get all projects with pagination
  getAllProjects: async (page = 1, size = 20) => {
    const response = await api.get('/project/admin/projects', {
      params: { page, size },
    });
    return response.data;
  },

  // Get single project by ID
  getProject: async (projectId) => {
    const response = await api.get(`/project/admin/projects/${projectId}`);
    return response.data;
  },

  // Create project
  createProject: async (formData) => {
    const response = await api.post('/project/admin/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update project
  updateProject: async (projectId, formData) => {
    const response = await api.put(`/project/admin/projects/${projectId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete project
  deleteProject: async (projectId) => {
    await api.delete(`/project/admin/projects/${projectId}`);
  },

  // Search projects with pagination
  searchProjects: async (query, page = 1, size = 20) => {
    const response = await api.get('/project/admin/projects/search', {
      params: { q: query, page, size },
    });
    return response.data;
  },

  // Get project suggestions
  getProjectSuggestions: async (query, limit = 5) => {
    const response = await api.get('/project/admin/projects/suggestion', {
      params: { q: query, limit },
    });
    return response.data;
  },
};