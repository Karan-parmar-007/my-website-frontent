import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { PasswordInput } from '@/components/password-input';
import { PasswordCharacter } from '@/components/password-character';
import SocialLinks from '@/components/social-links';
import EmailLink from '@/components/email-link';
import SimpleNavbar from '@/components/simple-navbar';
import SimpleLoader from '@/components/SimpleLoader';
import { useAuth } from '@/contexts/AuthContext';
import { verifyOTPAndReset, forgotPassword } from '@/lib/user_apis';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const email = location.state?.email || '';

  // Redirect if already logged in or no email in state
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [user, email, navigate]);

  // Cooldown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOTPAndReset(otp, newPassword);
      // Success - redirect to login with success message
      navigate('/login', { 
        replace: true,
        state: { message: response.message || 'Password reset successfully! Please log in.' }
      });
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setResending(true);
    setError('');

    try {
      await forgotPassword(email);
      setResendCooldown(30); // 30 second cooldown
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] flex flex-col">
      <SocialLinks />
      <EmailLink />
      
      <SimpleNavbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-4 md:pt-20 md:pb-8">
        <Card className="w-full max-w-md bg-[#112240] border-[#172a45] my-16 md:my-0">
          <CardHeader className="space-y-2 pb-4 md:pb-6 px-4 md:px-6 pt-4 md:pt-6">
            <PasswordCharacter isTyping={false} showPassword={showPassword || showConfirmPassword} />
            <CardTitle className="text-[#ccd6f6] text-xl md:text-2xl text-center">Verify OTP</CardTitle>
            <CardDescription className="text-[#8892b0] text-center text-xs md:text-sm">
              Enter the OTP sent to {email} and set your new password
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="otp" className="text-[#ccd6f6] text-xs md:text-sm font-medium">
                  OTP Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  required
                  disabled={loading}
                  maxLength={6}
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] placeholder:text-[#8892b0]/50 h-9 md:h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-[#ccd6f6] text-xs md:text-sm font-medium">
                  New Password
                </Label>
                <PasswordInput
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                  showPassword={showPassword}
                  onTogglePassword={setShowPassword}
                  autoComplete="new-password"
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] placeholder:text-[#8892b0]/50 h-9 md:h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-[#ccd6f6] text-xs md:text-sm font-medium">
                  Confirm Password
                </Label>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                  showPassword={showConfirmPassword}
                  onTogglePassword={setShowConfirmPassword}
                  autoComplete="new-password"
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] placeholder:text-[#8892b0]/50 h-9 md:h-10"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resending || resendCooldown > 0}
                  className="text-xs md:text-sm text-[#64ffda] hover:text-[#64ffda]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? (
                    <SimpleLoader className="text-xs" />
                  ) : resendCooldown > 0 ? (
                    `Resend OTP (${resendCooldown}s)`
                  ) : (
                    'Resend OTP'
                  )}
                </button>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-9 md:h-10 text-sm md:text-base font-medium mt-3 md:mt-4"
              >
                {loading ? <SimpleLoader className="justify-center" /> : 'Reset Password'}
              </Button>
            </form>
            <div className="mt-4 md:mt-5 text-center">
              <p className="text-[#8892b0] text-xs md:text-sm">
                Remember your password?{' '}
                <Link to="/login" className="text-[#64ffda] hover:text-[#64ffda]/80 font-medium transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VerifyOTP;
