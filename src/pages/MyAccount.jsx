import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { PasswordInput } from '@/components/password-input';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import SimpleLoader from '@/components/SimpleLoader';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/AuthContext';
import { updateCurrentUser, changePassword, getSessions, deleteSession, revokeAllSessions } from '@/lib/user_apis';

// Tab icons as SVG components
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const DevicesIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const TABS = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'security', label: 'Security', icon: LockIcon },
  { id: 'sessions', label: 'Sessions', icon: DevicesIcon },
];

const MyAccount = () => {
  const navigate = useNavigate();
  const { user, checkAuth, logout } = useAuth();
  const { addToast } = useToast();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile state
  const [userInfo, setUserInfo] = useState({
    preferred_name: '',
    email: '',
  });
  const [loadingInfo, setLoadingInfo] = useState(false);
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    logoutAllDevices: false,
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  
  // Sessions state
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState(null);
  const [revokingAll, setRevokingAll] = useState(false);

  // Fetch sessions
  const fetchSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const data = await getSessions();
      setSessions(Array.isArray(data) ? data : data.sessions || []);
    } catch (err) {
      addToast({
        title: 'Error',
        description: err.message || 'Failed to fetch sessions.',
        variant: 'error',
      });
    } finally {
      setLoadingSessions(false);
    }
  }, [addToast]);

  // Redirect if not logged in, populate user info
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    } else {
      setUserInfo({
        preferred_name: user.preferred_name || '',
        email: user.email || '',
      });
    }
  }, [user, navigate]);

  // Fetch sessions when tab changes to sessions
  useEffect(() => {
    if (activeTab === 'sessions' && sessions.length === 0) {
      fetchSessions();
    }
  }, [activeTab, sessions.length, fetchSessions]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoadingInfo(true);

    try {
      await updateCurrentUser({
        preferred_name: userInfo.preferred_name,
        email: userInfo.email.toLowerCase()
      });
      await checkAuth();
      addToast({
        title: 'Success',
        description: 'Your information has been updated successfully.',
        variant: 'success',
      });
    } catch (err) {
      addToast({
        title: 'Error',
        description: err.message || 'Failed to update information.',
        variant: 'error',
      });
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'error',
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      addToast({
        title: 'Error',
        description: 'Password must be at least 8 characters long.',
        variant: 'error',
      });
      return;
    }

    setLoadingPassword(true);

    try {
      await changePassword(
        passwordData.currentPassword, 
        passwordData.newPassword, 
        passwordData.confirmPassword,
        passwordData.logoutAllDevices
      );
      addToast({
        title: 'Success',
        description: 'Your password has been changed successfully.',
        variant: 'success',
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        logoutAllDevices: false,
      });
      
      // If logout all devices was checked, log out current user
      if (passwordData.logoutAllDevices) {
        await logout();
        navigate('/login', { replace: true });
      }
    } catch (err) {
      addToast({
        title: 'Error',
        description: err.message || 'Failed to change password.',
        variant: 'error',
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    setDeletingSessionId(sessionId);
    try {
      await deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      addToast({
        title: 'Success',
        description: 'Session has been revoked.',
        variant: 'success',
      });
    } catch (err) {
      addToast({
        title: 'Error',
        description: err.message || 'Failed to revoke session.',
        variant: 'error',
      });
    } finally {
      setDeletingSessionId(null);
    }
  };

  const handleRevokeAllSessions = async () => {
    setRevokingAll(true);
    try {
      await revokeAllSessions();
      addToast({
        title: 'Success',
        description: 'All other sessions have been revoked.',
        variant: 'success',
      });
      // Refresh sessions list
      await fetchSessions();
    } catch (err) {
      addToast({
        title: 'Error',
        description: err.message || 'Failed to revoke sessions.',
        variant: 'error',
      });
    } finally {
      setRevokingAll(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center md:text-left mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#ccd6f6] mb-3">My Account</h1>
            <p className="text-[#8892b0] text-lg">Manage your profile, security, and active sessions</p>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 p-1.5 bg-[#112240]/50 rounded-xl border border-[#172a45]">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                      font-medium text-sm transition-all duration-200
                      ${isActive 
                        ? 'bg-[#64ffda]/10 text-[#64ffda] shadow-lg shadow-[#64ffda]/5' 
                        : 'text-[#8892b0] hover:text-[#ccd6f6] hover:bg-[#172a45]/50'
                      }
                    `}
                  >
                    <Icon />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="transition-all duration-300">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card className="bg-[#112240]/80 backdrop-blur-sm border-[#172a45] shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[#ccd6f6] text-xl flex items-center gap-2">
                    <UserIcon />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-[#8892b0] text-sm">
                    View and update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                  {/* Member Since Badge */}
                  <div className="p-4 bg-gradient-to-r from-[#64ffda]/5 to-transparent rounded-lg border border-[#64ffda]/20">
                    <p className="text-xs text-[#64ffda] uppercase tracking-wider mb-1">Member Since</p>
                    <p className="text-lg font-semibold text-[#ccd6f6]">{formatDate(user.created_at)}</p>
                  </div>

                  {/* Editable info form */}
                  <form onSubmit={handleUpdateInfo} className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[#ccd6f6] text-sm font-medium">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          value={userInfo.preferred_name}
                          onChange={(e) => setUserInfo({ ...userInfo, preferred_name: e.target.value })}
                          required
                          disabled={loadingInfo}
                          className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] h-11 focus:border-[#64ffda] focus:ring-[#64ffda]/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#ccd6f6] text-sm font-medium">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userInfo.email}
                          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                          required
                          disabled={loadingInfo}
                          className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] h-11 focus:border-[#64ffda] focus:ring-[#64ffda]/20"
                        />
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={loadingInfo}
                        className="w-full md:w-auto min-w-[180px] h-11"
                      >
                        {loadingInfo ? <SimpleLoader className="justify-center" /> : 'Update Profile'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <Card className="bg-[#112240]/80 backdrop-blur-sm border-[#172a45] shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[#ccd6f6] text-xl flex items-center gap-2">
                    <LockIcon />
                    Change Password
                  </CardTitle>
                  <CardDescription className="text-[#8892b0] text-sm">
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <form onSubmit={handleChangePassword} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-[#ccd6f6] text-sm font-medium">Current Password</Label>
                      <PasswordInput
                        id="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        required
                        disabled={loadingPassword}
                        showPassword={showCurrentPassword}
                        onTogglePassword={setShowCurrentPassword}
                        autoComplete="current-password"
                        className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] h-11 focus:border-[#64ffda] focus:ring-[#64ffda]/20"
                      />
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-[#ccd6f6] text-sm font-medium">New Password</Label>
                        <PasswordInput
                          id="newPassword"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Enter new password"
                          required
                          disabled={loadingPassword}
                          showPassword={showNewPassword}
                          onTogglePassword={setShowNewPassword}
                          autoComplete="new-password"
                          className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] h-11 focus:border-[#64ffda] focus:ring-[#64ffda]/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-[#ccd6f6] text-sm font-medium">Confirm New Password</Label>
                        <PasswordInput
                          id="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                          required
                          disabled={loadingPassword}
                          showPassword={showConfirmPassword}
                          onTogglePassword={setShowConfirmPassword}
                          autoComplete="new-password"
                          className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] h-11 focus:border-[#64ffda] focus:ring-[#64ffda]/20"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-[#0a192f]/50 rounded-lg border border-[#172a45]">
                      <input
                        type="checkbox"
                        id="logoutAllDevices"
                        checked={passwordData.logoutAllDevices}
                        onChange={(e) => setPasswordData({ ...passwordData, logoutAllDevices: e.target.checked })}
                        disabled={loadingPassword}
                        className="h-4 w-4 rounded border-[#172a45] bg-[#0a192f] text-[#64ffda] focus:ring-[#64ffda]/20 cursor-pointer"
                      />
                      <Label 
                        htmlFor="logoutAllDevices" 
                        className="text-[#8892b0] text-sm cursor-pointer select-none"
                      >
                        Log out from all devices after password change
                      </Label>
                    </div>
                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={loadingPassword}
                        className="w-full md:w-auto min-w-[180px] h-11"
                      >
                        {loadingPassword ? <SimpleLoader className="justify-center" /> : 'Change Password'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <Card className="bg-[#112240]/80 backdrop-blur-sm border-[#172a45] shadow-xl">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-[#ccd6f6] text-xl flex items-center gap-2">
                          <DevicesIcon />
                          Active Sessions
                        </CardTitle>
                        <CardDescription className="text-[#8892b0] text-sm mt-1">
                          Manage devices where you're logged in
                        </CardDescription>
                      </div>
                      {sessions.length > 1 && (
                        <Button
                          variant="outline"
                          onClick={handleRevokeAllSessions}
                          disabled={revokingAll}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 h-10"
                        >
                          {revokingAll ? <SimpleLoader className="justify-center" /> : 'Revoke All Other Sessions'}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    {loadingSessions ? (
                      <div className="flex items-center justify-center py-12">
                        <SimpleLoader />
                      </div>
                    ) : sessions.length === 0 ? (
                      <div className="text-center py-12 text-[#8892b0]">
                        <DevicesIcon />
                        <p className="mt-2">No active sessions found</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {sessions.map((session) => {
                          // Parse device info from deviceInfo string
                          const deviceInfo = session.deviceInfo || '';
                          let deviceName = 'Unknown Device';
                          let deviceIcon = 'desktop';
                          
                          if (deviceInfo.includes('PostmanRuntime')) {
                            deviceName = 'Postman (API Client)';
                            deviceIcon = 'api';
                          } else if (deviceInfo.includes('Mobile') || deviceInfo.includes('Android') || deviceInfo.includes('iPhone')) {
                            deviceName = 'Mobile Device';
                            deviceIcon = 'mobile';
                          } else if (deviceInfo.includes('Chrome')) {
                            deviceName = 'Chrome Browser';
                          } else if (deviceInfo.includes('Firefox')) {
                            deviceName = 'Firefox Browser';
                          } else if (deviceInfo.includes('Safari')) {
                            deviceName = 'Safari Browser';
                          } else if (deviceInfo.includes('Edge')) {
                            deviceName = 'Edge Browser';
                          } else if (deviceInfo.includes('Mozilla')) {
                            deviceName = 'Web Browser';
                          }
                          
                          return (
                            <div
                              key={session.id}
                              className={`
                                relative p-4 rounded-lg border transition-all duration-200
                                ${session.isCurrent 
                                  ? 'bg-[#64ffda]/5 border-[#64ffda]/30' 
                                  : 'bg-[#0a192f]/50 border-[#172a45] hover:border-[#172a45]/80'
                                }
                              `}
                            >
                              {session.isCurrent && (
                                <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-medium bg-[#64ffda]/20 text-[#64ffda] rounded-full">
                                  Current
                                </span>
                              )}
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-[#172a45] rounded-lg">
                                  <DevicesIcon />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-[#ccd6f6] truncate">
                                    {deviceName}
                                  </p>
                                  <p className="text-xs text-[#8892b0] mt-1 break-all">
                                    {deviceInfo}
                                  </p>
                                  <p className="text-xs text-[#8892b0] mt-1">
                                    Created: {formatDateTime(session.createdAt)}
                                  </p>
                                  <p className="text-xs text-[#8892b0]">
                                    Expires: {formatDateTime(session.expiresAt)}
                                  </p>
                                </div>
                              </div>
                              {!session.isCurrent && (
                                <button
                                  onClick={() => handleDeleteSession(session.id)}
                                  disabled={deletingSessionId === session.id}
                                  className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
                                >
                                  {deletingSessionId === session.id ? (
                                    <SimpleLoader className="justify-center" />
                                  ) : (
                                    <>
                                      <TrashIcon />
                                      Revoke Session
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyAccount;
