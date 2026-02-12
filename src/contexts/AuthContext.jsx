import React, { createContext, useContext, useEffect, useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import apiClient from '../lib/apiClient'
import { queryKeys } from '../lib/queries/queryKeys'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Try to get sessions - if works, user is authenticated
        const { data: sessionData } = await apiClient.get('/auth/sessions')
        if (sessionData) {
          // Fetch actual user data from /user/me
          try {
            const { data: userData } = await apiClient.get('/user/me')
            setUser(userData)
            queryClient.setQueryData(queryKeys.currentUser, userData)
          } catch (userError) {
            // Session valid but couldn't get user data - use minimal auth state
            const cachedUser = queryClient.getQueryData(queryKeys.currentUser)
            setUser(cachedUser || { authenticated: true })
          }
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [queryClient])

  // Listen for forced logout
  useEffect(() => {
    const handleForcedLogout = () => {
      setUser(null)
      queryClient.setQueryData(queryKeys.currentUser, null)
    }

    window.addEventListener('auth:logout', handleForcedLogout)
    return () => window.removeEventListener('auth:logout', handleForcedLogout)
  }, [queryClient])

  // Login returns user data but doesn't set state immediately
  // The caller should navigate first, then call setUserAfterNav
  const login = useCallback(async (credentials) => {
    try {
      const { data } = await apiClient.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      })
      
      // Return user data for the caller to handle
      return { 
        success: true, 
        user: data?.user || { authenticated: true }
      }
    } catch (error) {
      const message = error.response?.data?.detail || error.message || 'Login failed'
      return { success: false, message }
    }
  }, [])

  // Call this AFTER navigation to set user state
  const setUserAfterNav = useCallback((userData) => {
    setUser(userData)
    if (userData) {
      queryClient.setQueryData(queryKeys.currentUser, userData)
    }
  }, [queryClient])

  const register = useCallback(async (userData) => {
    try {
      const { data } = await apiClient.post('/auth/signup', {
        preferredName: userData.name,
        email: userData.email,
        password: userData.password,
      })
      
      // Return user data for the caller to handle
      return { 
        success: true, 
        user: data?.user || { authenticated: true }
      }
    } catch (error) {
      const message = error.response?.data?.detail || error.message || 'Registration failed'
      return { success: false, message }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      setUser(null)
      queryClient.setQueryData(queryKeys.currentUser, null)
      queryClient.clear()
    }
  }, [queryClient])

  const checkAuth = useCallback(async () => {
    try {
      const { data: sessionData } = await apiClient.get('/auth/sessions')
      if (sessionData) {
        // Fetch actual user data from /user/me
        try {
          const { data: userData } = await apiClient.get('/user/me')
          setUser(userData)
          queryClient.setQueryData(queryKeys.currentUser, userData)
        } catch (userError) {
          // Session valid but couldn't get user data - use minimal auth state
          const cachedUser = queryClient.getQueryData(queryKeys.currentUser)
          setUser(cachedUser || { authenticated: true })
        }
      }
    } catch {
      setUser(null)
    }
  }, [queryClient])

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    setUserAfterNav, // New function to set user after navigation
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}