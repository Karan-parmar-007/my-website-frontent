import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from '@/components/loader';
import { AuthProvider } from '@/contexts/AuthContext';
import { RoleProvider } from '@/contexts/RoleContext';
import { PublicOnlyRoute, PrivateRoute } from '@/components/ProtectedRoute';
import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import Home from '@/pages/home';
import Login from '@/pages/login';
import Signup from '@/pages/signup';
import AdminDashboard from '@/pages/admin/dashboard';
import Portfolio from '@/pages/admin/portfolio';
import NotFound from '@/pages/NotFound';
import AccessDenied from '@/pages/AccessDenied';
import AlreadyLoggedIn from '@/pages/AlreadyLoggedIn';

function App() {
  const [showContent, setShowContent] = useState(false);

  return (
    <AuthProvider>
      <RoleProvider>
        <Router>
          <Loader onLoadComplete={() => setShowContent(true)} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <PublicOnlyRoute>
                    <Signup />
                  </PublicOnlyRoute>
                } 
              />
              
              {/* Error Pages */}
              <Route path="/already-logged-in" element={<AlreadyLoggedIn />} />
              <Route path="/access-denied" element={<AccessDenied />} />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute>
                    <RoleProtectedRoute requiredRoles={['super_admin']}>
                      <AdminDashboard />
                    </RoleProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <PrivateRoute>
                    <RoleProtectedRoute requiredRoles={['super_admin']}>
                      <AdminDashboard />
                    </RoleProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/portfolio" 
                element={
                  <PrivateRoute>
                    <RoleProtectedRoute requiredRoles={['super_admin']}>
                      <Portfolio />
                    </RoleProtectedRoute>
                  </PrivateRoute>
                } 
              />

              {/* 404 - Must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </Router>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;