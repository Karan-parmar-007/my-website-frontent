import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Get profile info
const getProfileInfo = async () => {
  try {
    const response = await api.get('/v1/portfolio/profile-info');
    return response.data;
  } catch (error) {
    console.error('getProfileInfo failed', error);
    throw error;
  }
};

// Get education
const getEducation = async () => {
  try {
    const response = await api.get('/v1/portfolio/education');
    return response.data;
  } catch (error) {
    console.error('getEducation failed', error);
    throw error;
  }
};

// Get work experience
const getWorkExperience = async () => {
  try {
    const response = await api.get('/v1/portfolio/work-experience');
    return response.data;
  } catch (error) {
    console.error('getWorkExperience failed', error);
    throw error;
  }
};

export const portfolioApi = {
  getProfileInfo,
  getEducation,
  getWorkExperience,
};