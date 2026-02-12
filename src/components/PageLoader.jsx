import { motion } from 'framer-motion';

/**
 * PageLoader - A theme-consistent content loading component.
 * Use this for in-page loading states (after the initial K animation).
 * Shows a pulsing hexagon with a loading message.
 */
const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-16 h-16 mb-6">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Pulsing hexagon */}
          <motion.path
            d="M 50, 5 L 11, 27 L 11, 72 L 50, 95 L 89, 73 L 89, 28 z"
            stroke="#64FFDA"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ opacity: 0.3, pathLength: 0 }}
            animate={{
              opacity: [0.3, 1, 0.3],
              pathLength: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />

          {/* K letter */}
          <motion.text
            x="36"
            y="66"
            fill="#64FFDA"
            fontSize="50"
            fontWeight="400"
            letterSpacing="4.16666603"
            fontFamily="system-ui, Calibre-Medium, Calibre, sans-serif"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          >
            K
          </motion.text>
        </svg>
      </div>
      <motion.p
        className="text-sm text-[#8892b0] font-mono"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default PageLoader;
