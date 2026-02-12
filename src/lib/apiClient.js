import axios from 'axios'

/**
 * Centralized API client with OAuth 2.0 token refresh handling
 * 
 * Security notes:
 * - Tokens are stored in httpOnly cookies (managed by backend)
 * - CSRF token is sent via cookie and validated by backend
 * - On 401 → attempt token refresh → if fails, logout user
 */

const API_URL = window.env?.VITE_API_URL || import.meta.env.VITE_API_URL
const API_PREFIX = '/v1'

// Create axios instance
const apiClient = axios.create({
  baseURL: `${API_URL}${API_PREFIX}`,
  withCredentials: true, // Send cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token refresh state to prevent multiple simultaneous refresh calls
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request interceptor - add CSRF token from cookie if available
apiClient.interceptors.request.use(
  (config) => {
    // Read CSRF token from cookie using robust Regex
    const match = document.cookie.match(/(^|;\s*)csrf_token=([^;]+)/);
    const csrfToken = match ? match[2] : null;

    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    } else {
      console.warn('CSRF Token not found in cookies!', document.cookie);
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle 401 and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Don't intercept auth endpoints to prevent infinite loops
    const authEndpoints = ['/auth/refresh', '/auth/login', '/auth/logout', '/auth/signup']
    const isAuthEndpoint = authEndpoints.some((endpoint) => originalRequest.url?.includes(endpoint))

    // If 401 and not an auth endpoint and not already retried
    if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the ongoing refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt to refresh the token
        await axios.post(
          `${API_URL}${API_PREFIX}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        processQueue(null)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        
        // Refresh failed - redirect to login
        // Dispatch a custom event that AuthContext can listen to
        window.dispatchEvent(new CustomEvent('auth:logout'))
        
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

/**
 * Helper for multipart/form-data requests (file uploads)
 */
export const apiClientFormData = axios.create({
  baseURL: `${API_URL}${API_PREFIX}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

// Add same interceptors to form data client
apiClientFormData.interceptors.request.use(
  (config) => {
    const match = document.cookie.match(/(^|;\s*)csrf_token=([^;]+)/);
    const csrfToken = match ? match[2] : null;

    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    } else {
      console.warn('CSRF Token not found in cookies (FormData)!', document.cookie);
    }

    return config
  },
  (error) => Promise.reject(error)
)

apiClientFormData.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const authEndpoints = ['/auth/refresh', '/auth/login', '/auth/logout', '/auth/signup']
    const isAuthEndpoint = authEndpoints.some((endpoint) => originalRequest.url?.includes(endpoint))

    if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => apiClientFormData(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axios.post(
          `${API_URL}${API_PREFIX}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        processQueue(null)
        return apiClientFormData(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        window.dispatchEvent(new CustomEvent('auth:logout'))
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
