import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import SocialLinks from '@/components/social-links';
import EmailLink from '@/components/email-link';
import SimpleNavbar from '@/components/simple-navbar';
import SimpleLoader from '@/components/SimpleLoader';
import { useAuth } from '@/contexts/AuthContext';
import { forgotPassword } from '@/lib/user_apis';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      setSuccessMessage(response.message || 'OTP sent successfully! Check your email.');
      
      // Navigate to OTP verification page after 2 seconds
      setTimeout(() => {
        navigate('/verify-otp', { state: { email } });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
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
            <CardTitle className="text-[#ccd6f6] text-xl md:text-2xl text-center">Forgot Password</CardTitle>
            <CardDescription className="text-[#8892b0] text-center text-xs md:text-sm">
              Enter your email address and we'll send you an OTP to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            {successMessage && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded text-green-400 text-sm">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[#ccd6f6] text-xs md:text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] placeholder:text-[#8892b0]/50 h-9 md:h-10"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-9 md:h-10 text-sm md:text-base font-medium"
              >
                {loading ? <SimpleLoader className="justify-center" /> : 'Send OTP'}
              </Button>
            </form>
            <div className="mt-4 md:mt-5 text-center space-y-2">
              <p className="text-[#8892b0] text-xs md:text-sm">
                Remember your password?{' '}
                <Link to="/login" className="text-[#64ffda] hover:text-[#64ffda]/80 font-medium transition-colors">
                  Log in
                </Link>
              </p>
              <p className="text-[#8892b0] text-xs md:text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#64ffda] hover:text-[#64ffda]/80 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ForgotPassword;
