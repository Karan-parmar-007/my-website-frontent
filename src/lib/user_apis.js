import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Login with JSON body
export const loginUser = async ({ email, password }) => {
  try {
    const response = await api.post('/v1/user/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('loginUser failed', error);
    throw error;
  }
};

// Register with JSON body
export const registerUser = async ({ name, email, password }) => {
  try {
    const response = await api.post('/v1/user/register', {
      preferred_name: name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('registerUser failed', error);
    throw error;
  }
};

// Current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/v1/user/me');
    return response.data;
  } catch (error) {
    console.error('getCurrentUser failed', error);
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await api.post('/v1/user/logout');
    return true;
  } catch (error) {
    console.error('logoutUser failed', error);
    throw error;
  }
};

// Register (axios version)
export const register = async (userData) => {
  try {
    const response = await api.post('/v1/user/register', {
      preferred_name: userData.name,
      email: userData.email,
      password: userData.password,
    });
    return response.data;
  } catch (error) {
    console.error('register failed', error);
    throw error;
  }
};

// Login (axios version)
export const login = async (credentials) => {
  try {
    const response = await api.post('/v1/user/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  } catch (error) {
    console.error('login failed', error);
    throw error;
  }
};

// Logout (axios version)
export const logout = async () => {
  try {
    const response = await api.post('/v1/user/logout');
    return response.data;
  } catch (error) {
    console.error('logout failed', error);
    throw error;
  }
};

// Verify session
export const verifySession = async () => {
  try {
    const response = await api.get('/v1/user/me');
    return response.data;
  } catch (error) {
    console.error('verifySession failed', error);
    return null;
  }
};

// Validate user roles
export const validateUserRole = async (requiredRoles) => {
  try {
    const response = await api.post('/v1/user/role-validator', { required_roles: requiredRoles });
    return response.data;
  } catch (error) {
    console.error('validateUserRole failed', error);
    throw error;
  }
};