import axios from 'axios';

// Use VITE env with a fallback and a clear name
const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log(`API_BASE_URL: ${API_BASE_URL}`);

const API_PREFIX = '/v1';
const API_V1_BASE_URL = `${API_BASE_URL}${API_PREFIX}`;

// Axios instance with cookies
const apiClient = axios.create({
  baseURL: API_V1_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const portfolioApi = {
  getProfileInfo: async () => {
    const response = await apiClient.get('/portfolio/profile-info');
    return response.data;
  },
  
  getEducation: async () => {
    const response = await apiClient.get('/portfolio/education');
    return response.data;
  },
  
  getWorkExperience: async () => {
    const response = await apiClient.get('/portfolio/work-experience');
    return response.data;
  },
};

export default apiClient;