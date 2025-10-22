import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ onLoadComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2500); // Animation duration

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (animationComplete) {
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        if (onLoadComplete) {
          onLoadComplete();
        }
      }, 500); // Delay before hiding

      return () => clearTimeout(hideTimer);
    }
  }, [animationComplete, onLoadComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a192f]"
        >
          <div className="relative w-24 h-24">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Hexagon Path */}
              <motion.path
                d="M 50, 5 L 11, 27 L 11, 72 L 50, 95 L 89, 73 L 89, 28 z"
                stroke="#64FFDA"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                }}
              />

              {/* Letter K */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 1,
                  delay: 2,
                  ease: "easeInOut",
                }}
              >
                <text
                  x="36"
                  y="66"
                  fill="#64FFDA"
                  fontSize="50"
                  fontWeight="400"
                  letterSpacing="4.16666603"
                  fontFamily="system-ui, Calibre-Medium, Calibre, sans-serif"
                >
                  K
                </text>
              </motion.g>
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;