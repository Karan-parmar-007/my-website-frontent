import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Prevents authenticated users from accessing login/signup
export const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
        <div className="text-[#64ffda]">Loading...</div>
      </div>
    );
  }

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// For future use - protects routes that require authentication
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
        <div className="text-[#64ffda]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};