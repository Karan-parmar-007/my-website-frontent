import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Login with JSON body
const loginUser = async ({ email, password }) => {
  try {
    const response = await api.post('/v1/user/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('loginUser failed', error);
    throw error;
  }
};

// Register with JSON body
const registerUser = async ({ name, email, password }) => {
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
const getCurrentUser = async () => {
  try {
    const response = await api.get('/v1/user/me');
    return response.data;
  } catch (error) {
    console.error('getCurrentUser failed', error);
    throw error;
  }
};

// Logout
const logoutUser = async () => {
  try {
    await api.post('/v1/user/logout');
    return true;
  } catch (error) {
    console.error('logoutUser failed', error);
    throw error;
  }
};

// Register (axios version)
const register = async (userData) => {
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
const login = async (credentials) => {
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
const logout = async () => {
  try {
    const response = await api.post('/v1/user/logout');
    return response.data;
  } catch (error) {
    console.error('logout failed', error);
    throw error;
  }
};

// Verify session
const verifySession = async () => {
  try {
    const response = await api.get('/v1/user/me');
    return response.data;
  } catch (error) {
    console.error('verifySession failed', error);
    return null;
  }
};

// Validate user roles
const validateUserRole = async (requiredRoles) => {
  try {
    const response = await api.post('/v1/user/role-validator', { required_roles: requiredRoles });
    return response.data;
  } catch (error) {
    console.error('validateUserRole failed', error);
    throw error;
  }
};

export const userApi = {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  register,
  login,
  logout,
  verifySession,
  validateUserRole,
};