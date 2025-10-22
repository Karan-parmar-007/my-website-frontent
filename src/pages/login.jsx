import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordInput } from '@/components/ui/password-input';
import { PasswordCharacter } from '@/components/ui/password-character';
import SocialLinks from '@/components/ui/social-links';
import EmailLink from '@/components/ui/email-link';
import Loader from '@/components/ui/loader';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check for success message from signup redirect
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      console.log("Attempting login with:", { email });
      const result = await login({ email, password });
      console.log("Login result received:", result);
      
      if (result.success) {
        console.log("Login successful, navigating to home");
        // Redirect to home page
        navigate('/');
      } else {
        console.log("Login failed:", result.message);
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !showContent) {
    return (
      <Loader
        onLoadComplete={() => {
          setShowContent(true);
          setLoading(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] flex flex-col">
      <SocialLinks />
      <EmailLink />
      
      {/* Simple Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a192f] backdrop-blur-sm border-b border-[#172a45]">
        <div className="max-w-screen-xxl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link to="/" className="flex-shrink-0">
              <svg width="36" height="36" viewBox="0 0 100 100" fill="none" className="md:w-10 md:h-10">
                <path
                  d="M 50, 5 L 11, 27 L 11, 72 L 50, 95 L 89, 73 L 89, 28 z"
                  stroke="#64FFDA"
                  strokeWidth="5"
                  fill="none"
                />
                <text
                  x="36"
                  y="66"
                  fill="#64FFDA"
                  fontSize="50"
                  fontWeight="400"
                  fontFamily="system-ui, Calibre-Medium, Calibre, sans-serif"
                >
                  K
                </text>
              </svg>
            </Link>
            <Link to="/" className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors text-sm md:text-base">
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-4 md:pt-20 md:pb-8">
        <Card className="w-full max-w-md bg-[#112240] border-[#172a45] my-16 md:my-0">
          <CardHeader className="space-y-2 pb-4 md:pb-6 px-4 md:px-6 pt-4 md:pt-6">
            <PasswordCharacter isTyping={false} showPassword={showPassword} />
            <CardTitle className="text-[#ccd6f6] text-xl md:text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-[#8892b0] text-center text-xs md:text-sm">
              Enter your credentials to access your account
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
                  disabled={isSubmitting}
                  autoComplete="email"
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] placeholder:text-[#8892b0]/50 h-9 md:h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[#ccd6f6] text-xs md:text-sm font-medium">
                  Password
                </Label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setIsTypingPassword(true);
                  }}
                  onFocus={() => setIsTypingPassword(true)}
                  onBlur={() => setIsTypingPassword(false)}
                  placeholder="Enter your password"
                  required
                  disabled={isSubmitting}
                  showPassword={showPassword}
                  onTogglePassword={setShowPassword}
                  autoComplete="current-password"
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] placeholder:text-[#8892b0]/50 h-9 md:h-10"
                />
              </div>
              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs md:text-sm text-[#64ffda] hover:text-[#64ffda]/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-9 md:h-10 text-sm md:text-base font-medium"
              >
                {isSubmitting ? 'Logging In...' : 'Log In'}
              </Button>
            </form>
            <div className="mt-4 md:mt-5 text-center">
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

export default Login;