import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { PasswordInput } from '@/components/password-input';
import { PasswordCharacter } from '@/components/password-character';
import SocialLinks from '@/components/social-links';
import EmailLink from '@/components/email-link';
import Loader from '@/components/loader';
import { useAuth } from '@/contexts/AuthContext';
import SimpleNavbar from '@/components/simple-navbar';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, checkAuth } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [isTypingConfirmPassword, setIsTypingConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({ name, email: email.toLowerCase(), password });
      if (result.success) {
        navigate('/', { replace: true });
        checkAuth(); // Update user state after navigation
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
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

  // Eyes should be closed when typing any password field AND that field's password is hidden
  // OR when both password fields are empty
  const isTypingAndHidden = 
    (isTypingPassword && !showPassword) || 
    (isTypingConfirmPassword && !showConfirmPassword);
  const bothFieldsEmpty = password.length === 0 && confirmPassword.length === 0;
  const shouldCloseEyes = isTypingAndHidden || bothFieldsEmpty;

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] flex flex-col">
      <SocialLinks />
      <EmailLink />
      
      <SimpleNavbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-4 md:pt-20 md:pb-8">
        <Card className="w-full max-w-md bg-[#112240] border-[#172a45] my-16 md:my-0">
          <CardHeader className="space-y-2 pb-4 md:pb-6 px-4 md:px-6 pt-4 md:pt-6">
            <PasswordCharacter 
              isTyping={false} 
              showPassword={showPassword || showConfirmPassword} 
            />
            <CardTitle className="text-[#ccd6f6] text-xl md:text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-[#8892b0] text-center text-xs md:text-sm">
              Fill in your details to get started
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
                <Label htmlFor="name" className="text-[#ccd6f6] text-xs md:text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  disabled={isSubmitting}
                  autoComplete="name"
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] placeholder:text-[#8892b0]/50 h-9 md:h-10"
                />
              </div>
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
                  placeholder="Create a strong password"
                  required
                  disabled={isSubmitting}
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
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setIsTypingConfirmPassword(true);
                  }}
                  onFocus={() => setIsTypingConfirmPassword(true)}
                  onBlur={() => setIsTypingConfirmPassword(false)}
                  placeholder="Confirm your password"
                  required
                  disabled={isSubmitting}
                  showPassword={showConfirmPassword}
                  onTogglePassword={setShowConfirmPassword}
                  autoComplete="new-password"
                  className="bg-[#0a192f] border-[#172a45] text-[#ccd6f6] placeholder:text-[#8892b0]/50 h-9 md:h-10"
                />
              </div>
              <div className="flex items-start space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                  disabled={isSubmitting}
                  className="mt-0.5 h-4 w-4 rounded border-[#172a45] bg-[#0a192f] text-[#64ffda] focus:ring-[#64ffda] focus:ring-offset-0 cursor-pointer"
                />
                <Label htmlFor="terms" className="text-[#8892b0] text-xs md:text-sm leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#64ffda] hover:text-[#64ffda]/80 transition-colors">
                    Terms and Conditions
                  </Link>
                </Label>
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-9 md:h-10 text-sm md:text-base font-medium mt-3 md:mt-4"
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
            <div className="mt-4 md:mt-5 text-center space-y-2">
              <p className="text-[#8892b0] text-xs md:text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-[#64ffda] hover:text-[#64ffda]/80 font-medium transition-colors">
                  Log in
                </Link>
              </p>
              <p className="text-[#8892b0] text-xs md:text-sm">
                Forgot your password?{' '}
                <Link to="/forgot-password" className="text-[#64ffda] hover:text-[#64ffda]/80 font-medium transition-colors">
                  Reset it here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Signup;