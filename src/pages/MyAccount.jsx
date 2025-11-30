import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { PasswordInput } from '@/components/password-input';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import SimpleLoader from '@/components/SimpleLoader';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/contexts/AuthContext';
import { updateCurrentUser, changePassword } from '@/lib/user_apis';

const MyAccount = () => {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const { addToast } = useToast();
  
  const [userInfo, setUserInfo] = useState({
    preferred_name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Redirect if not logged in
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

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoadingInfo(true);

    try {
      await updateCurrentUser(userInfo);
      await checkAuth(); // Refresh user data
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
      await changePassword(passwordData.currentPassword, passwordData.newPassword, passwordData.confirmPassword);
      addToast({
        title: 'Success',
        description: 'Your password has been changed successfully.',
        variant: 'success',
      });
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-[#ccd6f6] mb-3">My Account</h1>
            <p className="text-[#8892b0] text-lg">Manage your account settings and password</p>
          </div>

          {/* Account Information Card */}
          <Card className="bg-[#112240] border-[#172a45] shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#ccd6f6] text-xl">Account Information</CardTitle>
              <CardDescription className="text-[#8892b0] text-sm">
                View and update your basic account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              {/* Read-only info */}
              <div className="p-5 bg-[#0a192f] rounded-lg border border-[#172a45]">
                <div>
                  <p className="text-xs text-[#8892b0] uppercase tracking-wider mb-2">Member Since</p>
                  <p className="text-sm font-medium text-[#ccd6f6]">{formatDate(user.created_at)}</p>
                </div>
              </div>

              {/* Editable info form */}
              <form onSubmit={handleUpdateInfo} className="space-y-5">
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
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loadingInfo}
                    className="w-full md:w-auto min-w-[180px] h-11"
                  >
                    {loadingInfo ? <SimpleLoader className="justify-center" /> : 'Update Information'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="bg-[#112240] border-[#172a45] shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#ccd6f6] text-xl">Change Password</CardTitle>
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyAccount;
