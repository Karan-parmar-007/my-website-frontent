import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;  // This will be "https://karanparmar.in/api" at build time

const api = axios.create({
  baseURL: apiUrl,  // Sets base to https://karanparmar.in/api
  withCredentials: true,
});

// Profile Info
export const getProfileInfo = async () => {
  try {
    const response = await api.get('/v1/portfolio/profile-info');
    return response.data;
  } catch (error) {
    console.error('getProfileInfo failed', error);
    throw error;
  }
};

export const createProfileInfo = async (formData) => {
  try {
    const response = await api.post('/v1/portfolio/profile-info', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('createProfileInfo failed', error);
    throw error;
  }
};

export const updateProfileInfo = async (formData) => {
  try {
    const response = await api.put('/v1/portfolio/profile-info', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('updateProfileInfo failed', error);
    throw error;
  }
};

export const deleteProfileInfo = async () => {
  try {
    await api.delete('/v1/portfolio/profile-info');
  } catch (error) {
    console.error('deleteProfileInfo failed', error);
    throw error;
  }
};

// Education
export const getEducation = async () => {
  try {
    const response = await api.get('/v1/portfolio/education');
    return response.data;
  } catch (error) {
    console.error('getEducation failed', error);
    throw error;
  }
};

export const createEducation = async (data) => {
  try {
    const response = await api.post('/v1/portfolio/education', data);
    return response.data;
  } catch (error) {
    console.error('createEducation failed', error);
    throw error;
  }
};

export const updateEducation = async (data) => {
  try {
    const response = await api.put('/v1/portfolio/education', data);
    return response.data;
  } catch (error) {
    console.error('updateEducation failed', error);
    throw error;
  }
};

export const deleteEducation = async (educationId) => {
  try {
    await api.delete(`/v1/portfolio/education/${educationId}`);
  } catch (error) {
    console.error('deleteEducation failed', error);
    throw error;
  }
};

// Work Experience
export const getWorkExperience = async () => {
  try {
    const response = await api.get('/v1/portfolio/work-experience');
    return response.data;
  } catch (error) {
    console.error('getWorkExperience failed', error);
    throw error;
  }
};

export const createWorkExperience = async (data) => {
  try {
    const response = await api.post('/v1/portfolio/work-experience', data);
    return response.data;
  } catch (error) {
    console.error('createWorkExperience failed', error);
    throw error;
  }
};

export const updateWorkExperience = async (data) => {
  try {
    const response = await api.put('/v1/portfolio/work-experience', data);
    return response.data;
  } catch (error) {
    console.error('updateWorkExperience failed', error);
    throw error;
  }
};

export const deleteWorkExperience = async (workExperienceId) => {
  try {
    await api.delete(`/v1/portfolio/work-experience/${workExperienceId}`);
  } catch (error) {
    console.error('deleteWorkExperience failed', error);
    throw error;
  }
};

// Skill Categories
export const getSkillCategories = async () => {
  try {
    const response = await api.get('/v1/portfolio/skill-categories');
    return response.data;
  } catch (error) {
    console.error('getSkillCategories failed', error);
    throw error;
  }
};

export const createSkillCategory = async (data) => {
  try {
    const response = await api.post('/v1/portfolio/skill-categories', data);
    return response.data;
  } catch (error) {
    console.error('createSkillCategory failed', error);
    throw error;
  }
};

export const updateSkillCategory = async (data) => {
  try {
    const response = await api.put('/v1/portfolio/skill-categories', data);
    return response.data;
  } catch (error) {
    console.error('updateSkillCategory failed', error);
    throw error;
  }
};

export const deleteSkillCategory = async (categoryId) => {
  try {
    await api.delete(`/v1/portfolio/skill-categories/${categoryId}`);
  } catch (error) {
    console.error('deleteSkillCategory failed', error);
    throw error;
  }
};

// Skills
export const getSkills = async () => {
  try {
    const response = await api.get('/v1/portfolio/skills');
    return response.data;
  } catch (error) {
    console.error('getSkills failed', error);
    throw error;
  }
};

export const createSkill = async (formData) => {
  try {
    const response = await api.post('/v1/portfolio/skills', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('createSkill failed', error);
    throw error;
  }
};

export const updateSkill = async (formData) => {
  try {
    const response = await api.put('/v1/portfolio/skills', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('updateSkill failed', error);
    throw error;
  }
};

export const deleteSkill = async (skillId) => {
  try {
    await api.delete(`/v1/portfolio/skills/${skillId}`);
  } catch (error) {
    console.error('deleteSkill failed', error);
    throw error;
  }
};