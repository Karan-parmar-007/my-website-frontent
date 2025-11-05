import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Get all projects with pagination
const getAllProjects = async (page = 1, size = 20) => {
  try {
    const response = await api.get('/v1/project/admin/projects', {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('getAllProjects failed', error);
    throw error;
  }
};

// Get single project by ID
const getProject = async (projectId) => {
  try {
    const response = await api.get(`/v1/project/admin/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('getProject failed', error);
    throw error;
  }
};

// Create project
const createProject = async (formData) => {
  try {
    const response = await api.post('/v1/project/admin/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('createProject failed', error);
    throw error;
  }
};

// Update project
const updateProject = async (projectId, formData) => {
  try {
    const response = await api.put(`/v1/project/admin/projects/${projectId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('updateProject failed', error);
    throw error;
  }
};

// Delete project
const deleteProject = async (projectId) => {
  try {
    await api.delete(`/v1/project/admin/projects/${projectId}`);
  } catch (error) {
    console.error('deleteProject failed', error);
    throw error;
  }
};

// Search projects with pagination
const searchProjects = async (query, page = 1, size = 20) => {
  try {
    const response = await api.get('/v1/project/admin/projects/search', {
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
    const response = await api.get('/v1/project/admin/projects/suggestion', {
      params: { q: query, limit },
    });
    return response.data;
  } catch (error) {
    console.error('getProjectSuggestions failed', error);
    throw error;
  }
};

export const projectsApi = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  searchProjects,
  getProjectSuggestions,
};