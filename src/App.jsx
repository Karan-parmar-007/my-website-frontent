import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from '@/components/loader';
import { AuthProvider } from '@/contexts/AuthContext';
import { PublicOnlyRoute } from '@/components/ProtectedRoute';
import Home from '@/pages/home';
import Login from '@/pages/login';
import Signup from '@/pages/signup';
import AdminDashboard from '@/pages/admin/dashboard';

function App() {
  const [showContent, setShowContent] = useState(false);

  return (
    <AuthProvider>
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

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* Add other routes here */}
          </Routes>
          

        </motion.div>
      </Router>
    </AuthProvider>
  );
}

export default App;