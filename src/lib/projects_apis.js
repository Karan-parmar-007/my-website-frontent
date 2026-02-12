import apiClient, { apiClientFormData } from './apiClient';

export const projectsApi = {
  // Get all projects with pagination (public endpoint)
  getAllProjects: async (page = 1, size = 20) => {
    const response = await apiClient.get('/project/projects', {
      params: { page, size },
    });
    return response.data;
  },

  // Get single project by ID (public endpoint)
  getProject: async (projectId) => {
    const response = await apiClient.get(`/project/projects/${projectId}`);
    return response.data;
  },

  // Create project
  createProject: async (formData) => {
    const response = await apiClientFormData.post('/project/admin/projects', formData);
    return response.data;
  },

  // Update project
  updateProject: async (projectId, formData) => {
    const response = await apiClientFormData.put(`/project/admin/projects/${projectId}`, formData);
    return response.data;
  },

  // Delete project
  deleteProject: async (projectId) => {
    await apiClient.delete(`/project/admin/projects/${projectId}`);
  },

  // Search projects with pagination, skill filters, and date sorting (public endpoint)
  searchProjects: async (query, { page = 1, size = 20, skillIds = [], sortByDate = null } = {}) => {
    const params = { page, size };
    if (query) params.q = query;
    if (skillIds.length > 0) params.skillIds = skillIds;
    if (sortByDate) params.sortByDate = sortByDate;
    
    const response = await apiClient.get('/project/projects/search', {
      params,
      paramsSerializer: { indexes: null }, // skillIds=uuid1&skillIds=uuid2
    });
    return response.data.items || response.data || [];
  },

  // Get project suggestions (public endpoint)
  getProjectSuggestions: async (query, limit = 5) => {
    const response = await apiClient.get('/project/projects/suggestion', {
      params: { q: query, limit },
    });
    return response.data;
  },
};