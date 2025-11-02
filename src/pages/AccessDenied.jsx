import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SocialLinks from '@/components/social-links';
import EmailLink from '@/components/email-link';
import SimpleNavbar from '@/components/simple-navbar';
import { useAuth } from '@/contexts/AuthContext';

export default function AccessDenied() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] flex flex-col">
      <SocialLinks />
      <EmailLink />

      <SimpleNavbar />

      {/* Access Denied Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-20 md:pl-[140px] md:pr-[140px] lg:pl-[180px] lg:pr-[180px] xl:pl-[230px] xl:pr-[230px]">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Shield Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
              <ShieldAlert className="w-32 h-32 text-red-400 relative" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#ccd6f6]">
              Access Denied
            </h1>
            <p className="text-lg md:text-xl text-[#8892b0] max-w-md mx-auto">
              You don't have permission to access this page.
            </p>
            {user && (
              <p className="text-sm text-[#8892b0]">
                Logged in as: <span className="text-[#64ffda]">{user.email}</span>
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-[#112240] border border-[#172a45] rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold text-[#ccd6f6] mb-3">Why am I seeing this?</h3>
            <ul className="space-y-2 text-[#8892b0] text-sm">
              <li className="flex items-start">
                <span className="text-[#64ffda] mr-2">▹</span>
                <span>You may not have the required role to access this resource</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#64ffda] mr-2">▹</span>
                <span>Your account may not have the necessary permissions</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#64ffda] mr-2">▹</span>
                <span>This page may be restricted to administrators only</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
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
              onClick={() => window.history.back()}
              variant="outline"
              className="border-[#172a45] text-[#8892b0] hover:bg-[#172a45] hover:text-[#ccd6f6] px-6 h-12"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            {user && (
              <Button
                onClick={logout}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 px-6 h-12"
              >
                Sign Out
              </Button>
            )}
          </div>

          {/* Contact Info */}
          <div className="pt-8 text-[#8892b0] text-sm">
            <p>
              If you believe this is an error, please{' '}
              <a href="#contact" className="text-[#64ffda] hover:underline">
                contact the administrator
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}