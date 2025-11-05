import axios from 'axios';

const API_URL = window.env?.VITE_API_URL || import.meta.env.VITE_API_URL;


const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const portfolioAdminApi = {
  // Profile Info
  getProfileInfo: async () => {
    const response = await api.get('/v1/portfolio/profile-info');
    return response.data;
  },
  
  createProfileInfo: async (formData) => {
    const response = await api.post('/v1/portfolio/profile-info', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  updateProfileInfo: async (formData) => {
    const response = await api.put('/v1/portfolio/profile-info', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  deleteProfileInfo: async () => {
    await api.delete('/v1/portfolio/profile-info');
  },

  // Education
  getEducation: async () => {
    const response = await api.get('/v1/portfolio/education');
    return response.data;
  },
  
  createEducation: async (data) => {
    const response = await api.post('/v1/portfolio/education', data);
    return response.data;
  },
  
  updateEducation: async (data) => {
    const response = await api.put('/v1/portfolio/education', data);
    return response.data;
  },
  
  deleteEducation: async (educationId) => {
    await api.delete(`/v1/portfolio/education/${educationId}`);
  },

  // Work Experience
  getWorkExperience: async () => {
    const response = await api.get('/v1/portfolio/work-experience');
    return response.data;
  },
  
  createWorkExperience: async (data) => {
    const response = await api.post('/v1/portfolio/work-experience', data);
    return response.data;
  },
  
  updateWorkExperience: async (data) => {
    const response = await api.put('/v1/portfolio/work-experience', data);
    return response.data;
  },
  
  deleteWorkExperience: async (workExperienceId) => {
    await api.delete(`/v1/portfolio/work-experience/${workExperienceId}`);
  },

  // Skill Categories
  getSkillCategories: async () => {
    const response = await api.get('/v1/portfolio/skill-categories');
    return response.data;
  },
  
  createSkillCategory: async (data) => {
    const response = await api.post('/v1/portfolio/skill-categories', data);
    return response.data;
  },
  
  updateSkillCategory: async (data) => {
    const response = await api.put('/v1/portfolio/skill-categories', data);
    return response.data;
  },
  
  deleteSkillCategory: async (categoryId) => {
    await api.delete(`/v1/portfolio/skill-categories/${categoryId}`);
  },

  // Skills
  getSkills: async () => {
    const response = await api.get('/v1/portfolio/skills');
    return response.data;
  },
  
  createSkill: async (formData) => {
    const response = await api.post('/v1/portfolio/skills', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  updateSkill: async (formData) => {
    const response = await api.put('/v1/portfolio/skills', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  deleteSkill: async (skillId) => {
    await api.delete(`/v1/portfolio/skills/${skillId}`);
  },
};