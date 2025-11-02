import { Link } from 'react-router-dom';

const SimpleNavbar = ({ rightText = 'Home', rightLink = '/' }) => {
  return (
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
          <Link 
            to={rightLink} 
            className="text-[#ccd6f6] hover:text-[#64ffda] transition-colors text-sm md:text-base"
          >
            {rightText}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavbar;