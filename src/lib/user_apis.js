import axios from 'axios';

// Normalize base URL and ensure /api/v1 prefix
const API_V1_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
// Axios instance with cookies
const apiClient = axios.create({
  baseURL: API_V1_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Login with JSON body
export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${API_V1_BASE_URL}/v1/user/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let errorDetail = 'Login failed';
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  try {
    return await response.json();
  } catch {
    return {};
  }
};

// Register with JSON body
export const registerUser = async ({ name, email, password }) => {
  const payload = {
    // Adjust field names to your API schema if different
    preferred_name: name,
    email,
    password,
  };

  const response = await fetch(`${API_V1_BASE_URL}/v1/user/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorDetail = 'Registration failed';
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  try {
    return await response.json();
  } catch {
    return {};
  }
};

// Current user (assumes /api/v1/user/me exists)
export const getCurrentUser = async () => {
  const response = await fetch(`${API_V1_BASE_URL}/v1/user/me`, {
    credentials: 'include',
  });

  if (!response.ok) {
    let errorDetail = 'Unauthorized';
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  return response.json();
};

// Logout
export const logoutUser = async () => {
  const response = await fetch(`${API_V1_BASE_URL}/v1/user/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
  return true;
};

// Optional axios versions (JSON body)
export const userApi = {
  register: async (userData) => {
    try {
      const res = await apiClient.post('/v1/user/register', {
        preferred_name: userData.name,
        email: userData.email,
        password: userData.password,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  login: async (credentials) => {
    try {
      const res = await apiClient.post('/v1/user/login', {
        email: credentials.email,
        password: credentials.password,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout: async () => {
    try {
      const res = await apiClient.post('/v1/user/logout');
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  verifySession: async () => {
    try {
      const res = await apiClient.get('/v1/user/me');
      return res.data;
    } catch {
      return null;
    }
  },
};