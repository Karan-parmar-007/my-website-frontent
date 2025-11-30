import { motion } from 'framer-motion';

const SimpleLoader = ({ className = '' }) => {
  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [-3, 0, -3],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="text-[#64ffda]">Loading</span>
      <div className="flex gap-0.5">
        <motion.span
          className="text-[#64ffda] text-xl leading-none"
          variants={dotVariants}
          initial="initial"
          animate="animate"
        >
          .
        </motion.span>
        <motion.span
          className="text-[#64ffda] text-xl leading-none"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          .
        </motion.span>
        <motion.span
          className="text-[#64ffda] text-xl leading-none"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
        >
          .
        </motion.span>
      </div>
    </div>
  );
};

export default SimpleLoader;
