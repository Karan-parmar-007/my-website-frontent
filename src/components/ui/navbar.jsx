import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfileData } from '@/hooks/usePortfolioData';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { profileData } = useProfileData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { number: '01', text: 'About', href: '#about' },
    { number: '02', text: 'Experience', href: '#experience' },
    { number: '03', text: 'Work', href: '#work' },
    { number: '04', text: 'Contact', href: '#contact' },
  ];

  const handleDownloadResume = () => {
    if (profileData?.resume_file_base64) {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${profileData.resume_file_base64}`;
      link.download = 'resume.pdf';
      link.click();
    }
  };

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    await logout();
    navigate('/');
  };

  const handleLogin = () => {
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  const handleSignUp = () => {
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate('/signup');
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const userMenuButton = document.getElementById('user-menu-button');
      const userMenuDropdown = document.getElementById('user-menu-dropdown');
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      const navbarMenu = document.getElementById('navbar-menu');

      if (
        isUserMenuOpen &&
        userMenuButton &&
        userMenuDropdown &&
        !userMenuButton.contains(event.target) &&
        !userMenuDropdown.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }

      if (
        isMenuOpen &&
        mobileMenuButton &&
        navbarMenu &&
        !mobileMenuButton.contains(event.target) &&
        !navbarMenu.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isUserMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a192f] backdrop-blur-sm border-b border-[#172a45]">
      <div className="max-w-screen-xxl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/">
              <svg width="42" height="42" viewBox="0 0 100 100" fill="none">
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
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-8">
              {navItems.map((item) => (
                <li key={item.number}>
                  <a
                    href={item.href}
                    className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors flex items-center gap-2 text-sm"
                  >
                    <span className="text-[#64ffda]">{item.number}.</span>
                    <span>{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* User Menu / Auth Buttons */}
            {user ? (
              <div className="relative flex items-center gap-4">
                <button
                  id="user-menu-button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-[#8892b0]" /* no hover effect */
                  aria-label="User menu"
                >
                  {/* slightly larger classic user icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </button>

                {/* Larger Dropdown Menu, no hover color changes */}
                {isUserMenuOpen && (
                  <div
                    id="user-menu-dropdown"
                    className="absolute right-0 top-14 w-56 bg-[#112240] border border-[#172a45] rounded-md shadow-lg py-3 z-50"
                  >
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('/account');
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-[#ccd6f6] hover:text-[#64ffda] transition-colors"
                    >
                      Account
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-sm text-[#ccd6f6] hover:text-[#64ffda] transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}

                {/* Resume Button */}
                {profileData?.resume_file_base64 && (
                  <Button onClick={handleDownloadResume} variant="outline" className="px-4 h-10">
                    Resume
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button onClick={handleLogin} variant="outline" className="px-4 h-10">
                  Log in
                </Button>
                <Button onClick={handleSignUp} variant="outline" className="px-4 h-10">
                  Sign up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5"
          >
            <span className={`w-6 h-0.5 bg-[#64ffda] transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-[#64ffda] transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-[#64ffda] transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div id="navbar-menu" className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden w-full pb-4`}>
          <ul className="flex flex-col gap-2 mt-4">
            {navItems.map((item) => (
              <li key={item.number}>
                <a
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 px-4 text-[#ccd6f6] hover:text-[#64ffda] hover:bg-[#172a45] rounded-lg transition-colors"
                >
                  <span className="text-[#64ffda] mr-2 text-sm">{item.number}.</span>
                  <span className="text-base">{item.text}</span>
                </a>
              </li>
            ))}

            {/* Mobile Auth/Options */}
            {user ? (
              <>
                <li className="border-t border-[#172a45] mt-2 pt-2">
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/account');
                    }}
                    variant="outline"
                    className="w-full px-4 h-10"
                  >
                    Account
                  </Button>
                </li>
                {profileData?.resume_file_base64 && (
                  <li>
                    <Button
                      onClick={() => {
                        handleDownloadResume();
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full px-4 h-10"
                    >
                      Resume
                    </Button>
                  </li>
                )}
                <li>
                  <Button onClick={handleSignOut} variant="outline" className="w-full px-4 h-10 text-[#64ffda] rounded-lg transition-colors">
                    Sign out
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li className="border-t border-[#172a45] mt-2 pt-2">
                  <Button onClick={handleLogin} variant="outline" className="w-full px-4 h-10">
                    Log in
                  </Button>
                </li>
                <li>
                  <Button onClick={handleSignUp} variant="outline" className="w-full px-4 h-10">
                    Sign up
                  </Button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;