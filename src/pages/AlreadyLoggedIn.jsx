import { Link, useNavigate } from 'react-router-dom';
import { UserCheck, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SocialLinks from '@/components/social-links';
import EmailLink from '@/components/email-link';
import { useAuth } from '@/contexts/AuthContext';

export default function AlreadyLoggedIn() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-20 md:pl-[140px] md:pr-[140px] lg:pl-[180px] lg:pr-[180px] xl:pl-[230px] xl:pr-[230px]">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#64ffda]/20 blur-3xl rounded-full"></div>
              <UserCheck className="w-32 h-32 text-[#64ffda] relative" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#ccd6f6]">
              Already Logged In
            </h1>
            <p className="text-lg md:text-xl text-[#8892b0] max-w-md mx-auto">
              You're already signed in to your account.
            </p>
            {user && (
              <div className="bg-[#112240] border border-[#172a45] rounded-lg p-4 inline-block">
                <p className="text-sm text-[#8892b0]">
                  Logged in as: <span className="text-[#64ffda] font-medium">{user.email}</span>
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              asChild
              variant="outline"
              className="border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10 px-6 h-12"
            >
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-[#172a45] text-[#8892b0] hover:bg-[#172a45] hover:text-[#ccd6f6] px-6 h-12"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-8 text-[#8892b0] text-sm">
            <p>Want to access a different account? Sign out first.</p>
          </div>
        </div>
      </main>
    </div>
  );
}