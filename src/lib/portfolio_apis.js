import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log(`API_BASE_URL: ${API_BASE_URL}`);


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const portfolioApi = {
  getProfileInfo: async () => {
    const response = await api.get('/v1/portfolio/profile-info');
    return response.data;
  },
  
  getEducation: async () => {
    const response = await api.get('/v1/portfolio/education');
    return response.data;
  },
  
  getWorkExperience: async () => {
    const response = await api.get('/v1/portfolio/work-experience');
    return response.data;
  },
};

export default api;