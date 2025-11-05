import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Get all memberships
export const getAllMemberships = async () => {
  try {
    const response = await api.get('/v1/project/memberships');
    return response.data;
  } catch (error) {
    console.error('getAllMemberships failed', error);
    throw error;
  }
};

// Get memberships by project
export const getMembershipsByProject = async (projectId) => {
  try {
    const response = await api.get(`/v1/project/memberships/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('getMembershipsByProject failed', error);
    throw error;
  }
};

// Get memberships by user
export const getMembershipsByUser = async (userId) => {
  try {
    const response = await api.get(`/v1/project/memberships/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('getMembershipsByUser failed', error);
    throw error;
  }
};

// Search users in project
export const searchUsersInProject = async (projectId, query, limit = 20) => {
  try {
    const response = await api.get('/v1/project/memberships/search', {
      params: { project_id: projectId, q: query, limit },
    });
    return response.data;
  } catch (error) {
    console.error('searchUsersInProject failed', error);
    throw error;
  }
};

// Create membership
export const createMembership = async (data) => {
  try {
    const response = await api.post('/v1/project/memberships', data);
    return response.data;
  } catch (error) {
    console.error('createMembership failed', error);
    throw error;
  }
};

// Remove membership
export const removeMembership = async (userId, projectId) => {
  try {
    await api.delete('/v1/project/memberships', {
      params: { user_id: userId, project_id: projectId },
    });
  } catch (error) {
    console.error('removeMembership failed', error);
    throw error;
  }
};