import axios from 'axios';

const API_URL = window.env?.VITE_API_URL || import.meta.env.VITE_API_URL;


const api = axios.create({
  baseURL: `${API_URL}/v1`,
  withCredentials: true,
});

export const projectMembershipApi = {
  // Get all memberships
  getAllMemberships: async () => {
    const response = await api.get('/project/memberships');
    return response.data;
  },

  // Get memberships by project
  getMembershipsByProject: async (projectId) => {
    const response = await api.get(`/project/memberships/project/${projectId}`);
    return response.data;
  },

  // Get memberships by user
  getMembershipsByUser: async (userId) => {
    const response = await api.get(`/project/memberships/user/${userId}`);
    return response.data;
  },

  // Search users in project
  searchUsersInProject: async (projectId, query, limit = 20) => {
    const response = await api.get('/project/memberships/search', {
      params: { project_id: projectId, q: query, limit },
    });
    return response.data;
  },

  // Create membership (add user to project)
  createMembership: async (data) => {
    const response = await api.post('/project/memberships', data);
    return response.data;
  },

  // Remove membership (remove user from project)
  removeMembership: async (userId, projectId) => {
    await api.delete('/project/memberships', {
      params: { user_id: userId, project_id: projectId },
    });
  },
};