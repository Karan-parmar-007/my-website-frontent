import axios from 'axios';

// Normalize base URL and ensure /api/v1 prefix
const API_URL = window.env?.VITE_API_URL || import.meta.env.VITE_API_URL;
const API_PREFIX = '/v1';
const API_V1_BASE_URL = `${API_URL}${API_PREFIX}`;

// Axios instance with cookies
const apiClient = axios.create({
  baseURL: API_V1_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Login with JSON body
export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${API_V1_BASE_URL}/user/login`, {
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

  const response = await fetch(`${API_V1_BASE_URL}/user/register`, {
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

// Current user (assumes /user/me exists)
export const getCurrentUser = async () => {
  const response = await fetch(`${API_V1_BASE_URL}/user/me`, {
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
  const response = await fetch(`${API_V1_BASE_URL}/user/logout`, {
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
      const res = await apiClient.post('/user/register', {
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
      const res = await apiClient.post('/user/login', {
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
      const res = await apiClient.post('/user/logout');
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  verifySession: async () => {
    try {
      const res = await apiClient.get('/user/me');
      return res.data;
    } catch {
      return null;
    }
  },
};

// Add this function to validate user roles
export const validateUserRole = async (requiredRoles) => {
  const response = await fetch(`${API_V1_BASE_URL}/user/role-validator`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ required_roles: requiredRoles }),
  });

  if (!response.ok) {
    throw new Error('Role validation failed');
  }

  return response.json();
};

// Forgot password - sends OTP
export const forgotPassword = async (email) => {
  const response = await fetch(`${API_V1_BASE_URL}/user/password/forgot`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    let errorDetail = 'Failed to send OTP';
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  return response.json();
};

// Verify OTP and reset password
export const verifyOTPAndReset = async (otp, newPassword) => {
  const response = await fetch(`${API_V1_BASE_URL}/user/password/verify-otp`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp, new_password: newPassword }),
  });

  if (!response.ok) {
    let errorDetail = 'Failed to verify OTP';
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  return response.json();
};

// Change password (logged-in user)
export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  const response = await fetch(`${API_V1_BASE_URL}/user/password/change`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      current_password: currentPassword, 
      new_password: newPassword,
      confirm_password: confirmPassword
    }),
  });

  if (!response.ok) {
    let errorDetail = 'Failed to change password';
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  return response.json();
};

// Update current user (basic info only - no password)
export const updateCurrentUser = async (userData) => {
  const response = await fetch(`${API_V1_BASE_URL}/user/me`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    let errorDetail = 'Failed to update user';
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  return response.json();
};

// Admin reset user password
export const adminResetPassword = async (userId, newPassword) => {
  const response = await fetch(`${API_V1_BASE_URL}/user/password/admin-reset`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      user_id: userId, 
      new_password: newPassword 
    }),
  });

  if (!response.ok) {
    let errorDetail = 'Failed to reset password';
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  return response.json();
};