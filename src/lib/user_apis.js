// Import the shared apiClient which has CSRF token interceptors
import apiClient from './apiClient';

// Normalize base URL and ensure /api/v1 prefix
const API_URL = window.env?.VITE_API_URL || import.meta.env.VITE_API_URL;
const API_PREFIX = '/v1';
const API_V1_BASE_URL = `${API_URL}${API_PREFIX}`;

// Helper to get CSRF token from cookies for fetch requests
const getCsrfToken = () => {
  const match = document.cookie.match(/(^|;\s*)csrf_token=([^;]+)/);
  return match ? match[2] : null;
};

// Helper to get headers with CSRF token for fetch requests
const getHeadersWithCsrf = (contentType = 'application/json') => {
  const headers = { 'Content-Type': contentType };
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }
  return headers;
};

// Login with JSON body
export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${API_V1_BASE_URL}/user/login`, {
    method: 'POST',
    credentials: 'include',
    headers: getHeadersWithCsrf(),
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
    headers: getHeadersWithCsrf(),
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
    headers: getHeadersWithCsrf(),
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
    headers: getHeadersWithCsrf(),
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
    headers: getHeadersWithCsrf(),
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
    headers: getHeadersWithCsrf(),
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
export const changePassword = async (currentPassword, newPassword, confirmPassword, logoutAllDevices = false) => {
  const response = await fetch(`${API_V1_BASE_URL}/auth/change-password`, {
    method: 'POST',
    credentials: 'include',
    headers: getHeadersWithCsrf(),
    body: JSON.stringify({ 
      currentPassword, 
      newPassword,
      confirmPassword,
      logoutAllDevices
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
    headers: getHeadersWithCsrf(),
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
export const adminResetPassword = async (userId, email, newPassword) => {
  const response = await fetch(`${API_V1_BASE_URL}/user/password/admin-reset`, {
    method: 'POST',
    credentials: 'include',
    headers: getHeadersWithCsrf(),
    body: JSON.stringify({ 
      user_id: userId,
      email: email,
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

// Get all active sessions
export const getSessions = async () => {
  const response = await fetch(`${API_V1_BASE_URL}/auth/sessions`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    let errorDetail = 'Failed to fetch sessions';
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  return response.json();
};

// Delete a specific session
export const deleteSession = async (sessionId) => {
  const response = await fetch(`${API_V1_BASE_URL}/auth/sessions/${sessionId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: getHeadersWithCsrf(),
  });

  if (!response.ok) {
    let errorDetail = 'Failed to delete session';
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  // Handle 204 No Content or JSON response
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return { success: true };
};

// Revoke all sessions (except current)
export const revokeAllSessions = async () => {
  const response = await fetch(`${API_V1_BASE_URL}/auth/sessions`, {
    method: 'DELETE',
    credentials: 'include',
    headers: getHeadersWithCsrf(),
  });

  if (!response.ok) {
    let errorDetail = 'Failed to revoke sessions';
    try {
      const err = await response.json();
      errorDetail = err.detail || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  // Handle 204 No Content or JSON response
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return { success: true };
};