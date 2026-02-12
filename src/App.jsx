import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from '@/contexts/RoleContext';
import { PublicOnlyRoute, PrivateRoute } from '@/components/ProtectedRoute';
import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import Home from '@/pages/home';
import ProjectsPage from '@/pages/project';
import Login from '@/pages/login';
import Signup from '@/pages/signup';
import AdminDashboard from '@/pages/admin/dashboard';
import Portfolio from '@/pages/admin/portfolio';
import AdminProjectsPage from '@/pages/admin/projects';
import SkillsPage from '@/pages/skills';
import ProjectAccessLevelPage from '@/pages/admin/project_access_level';
import ProjectMembershipPage from '@/pages/admin/project_membership';
import NotFound from '@/pages/NotFound';
import AccessDenied from '@/pages/AccessDenied';
import AlreadyLoggedIn from '@/pages/AlreadyLoggedIn';
import RolesAndPermissions from './pages/admin/RolesAndPermissions';
import UsersPage from '@/pages/admin/users';
import ForgotPassword from '@/pages/ForgotPassword';
import VerifyOTP from '@/pages/VerifyOTP';
import MyAccount from '@/pages/MyAccount';
import { ToastProvider } from '@/components/ui/toast';

function App() {
  return (
    <RoleProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/skills" element={<SkillsPage />} />
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
              <Route 
                path="/forgot-password" 
                element={
                  <PublicOnlyRoute>
                    <ForgotPassword />
                  </PublicOnlyRoute>
                } 
              />
              <Route 
                path="/verify-otp" 
                element={
                  <PublicOnlyRoute>
                    <VerifyOTP />
                  </PublicOnlyRoute>
                } 
              />
              <Route 
                path="/my-account" 
                element={
                  <PrivateRoute>
                    <MyAccount />
                  </PrivateRoute>
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
                    <RoleProtectedRoute requiredRoles={['super_admin', 'admin_family', 'admin']}>
                      <AdminDashboard />
                    </RoleProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <PrivateRoute>
                    <RoleProtectedRoute requiredRoles={['super_admin', 'admin_family', 'admin']}>
                      <AdminDashboard />
                    </RoleProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/portfolio" 
                element={
                  <PrivateRoute>
                    <RoleProtectedRoute requiredRoles={['super_admin', 'admin_family', 'admin']}>
                      <Portfolio />
                    </RoleProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/projects" 
                element={
                  <PrivateRoute>
                    <RoleProtectedRoute requiredRoles={['super_admin', 'admin_family', 'admin']}>
                      <AdminProjectsPage />
                    </RoleProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/project-access-levels" 
                element={
                  <PrivateRoute>
                    <RoleProtectedRoute requiredRoles={['super_admin', 'admin_family', 'admin']}>
                      <ProjectAccessLevelPage />
                    </RoleProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/project-membership" 
                element={
                  <PrivateRoute>
                    <RoleProtectedRoute requiredRoles={['super_admin', 'admin_family', 'admin']}>
                      <ProjectMembershipPage />
                    </RoleProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/roles" 
                element={
                  <PrivateRoute>
                    <RoleProtectedRoute requiredRoles={['super_admin', 'admin_family', 'admin']}>
                      <RolesAndPermissions />
                    </RoleProtectedRoute>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <PrivateRoute>
                    <RoleProtectedRoute requiredRoles={['super_admin', 'admin_family', 'admin']}>
                      <UsersPage />
                    </RoleProtectedRoute>
                  </PrivateRoute>
                } 
              />

              {/* 404 - Must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </RoleProvider>
  );
}

export default App;