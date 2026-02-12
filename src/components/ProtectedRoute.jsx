import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Prevents authenticated users from accessing login/signup
export const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
        <div className="text-[#64ffda]">Loading...</div>
      </div>
    );
  }

  // If user is already logged in and tries to access login/signup, show the already-logged-in page
  if (user) {
    // Check if they're trying to access login or signup specifically
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    if (isAuthPage) {
      return <Navigate to="/" replace />;
    }

    // Otherwise redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

// Protects routes that require authentication
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
        <div className="text-[#64ffda]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};