import React, { createContext, useContext, useCallback } from 'react';
import { validateUserRole } from '../lib/user_apis';
import { useAuth } from './AuthContext';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { user } = useAuth();

  const hasRole = useCallback(async (requiredRoles) => {
    if (!user) {
      return false;
    }

    try {
      const result = await validateUserRole(requiredRoles);
      return result.has_role;
    } catch (error) {
      console.error('Role validation error:', error);
      return false;
    }
  }, [user]);

  return (
    <RoleContext.Provider value={{ hasRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);