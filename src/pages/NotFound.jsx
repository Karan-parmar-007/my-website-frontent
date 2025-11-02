import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SocialLinks from '@/components/social-links';
import EmailLink from '@/components/email-link';
import SimpleNavbar from '@/components/simple-navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a192f] text-[#ccd6f6] flex flex-col">
      <SocialLinks />
      <EmailLink />

      <SimpleNavbar />

      {/* 404 Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-20 md:pl-[140px] md:pr-[140px] lg:pl-[180px] lg:pr-[180px] xl:pl-[230px] xl:pr-[230px]">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Large 404 Text */}
          <div className="relative">
            <h1 className="text-[150px] md:text-[200px] lg:text-[250px] font-bold text-[#64ffda] opacity-10 leading-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#ccd6f6]">
                  Page Not Found
                </h2>
                <p className="text-lg md:text-xl text-[#8892b0] max-w-md mx-auto">
                  Oops! The page you're looking for doesn't exist or has been moved.
                </p>
              </div>
            </div>
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
              onClick={() => window.history.back()}
              variant="outline"
              className="border-[#172a45] text-[#8892b0] hover:bg-[#172a45] hover:text-[#ccd6f6] px-6 h-12"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-8 text-[#8892b0] text-sm">
            <p>If you think this is a mistake, please contact me.</p>
          </div>
        </div>
      </main>
    </div>
  );
}