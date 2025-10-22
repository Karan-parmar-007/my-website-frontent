import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const FETCH_API_BASE_URL = 'http://localhost:8000/api/v1';

// Create axios instance - withCredentials is crucial for cookies
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This sends cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch-based login
export const loginUser = async (credentials) => {
  const response = await fetch(`${FETCH_API_BASE_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  return response.json();
};

// Fetch-based register
export const registerUser = async (userData) => {
  const response = await fetch(`${FETCH_API_BASE_URL}/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Registration failed');
  }

  return response.json();
};

export const userApi = {
  // Register new user (axios)
  register: async (userData) => {
    try {
      const response = await apiClient.post('/v1/user/register', {
        preferred_name: userData.name,
        email: userData.email,
        password: userData.password,
      });
      console.log('Register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user (axios)
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/v1/user/login', {
        email: credentials.email,
        password: credentials.password,
      });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiClient.post('/v1/user/logout');
      console.log('Logged out successfully');
      return response.data;
    } catch (error) {
      console.log('Logout error (clearing session anyway):', error);
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  // Verify current session - cookie is sent automatically
  verifySession: async () => {
    try {
      console.log('Verifying session with cookie...');
      const response = await apiClient.get('/v1/user/me');
      console.log('Session verification response:', response.data);
      return response.data;
    } catch (error) {
      console.log('Session verification failed:', error.response?.status, error.response?.data);
      return null;
    }
  },
};