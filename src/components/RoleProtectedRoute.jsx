import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';

export const RoleProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading: authLoading } = useAuth();
  const { hasRole } = useRole();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const hasRequiredRole = await hasRole(requiredRoles);
        setAuthorized(hasRequiredRole);
      } catch (error) {
        console.error('Role check failed:', error);
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    checkRole();
  }, [user, hasRole, requiredRoles]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
        <div className="text-[#64ffda]">Checking permissions...</div>
      </div>
    );
  }

  if (!user) {
    // Save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!authorized) {
    // Redirect to custom access denied page instead of inline component
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};