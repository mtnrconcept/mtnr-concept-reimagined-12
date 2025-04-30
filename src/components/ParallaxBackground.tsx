
import React, { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ParallaxBackgroundProps {
  children: ReactNode;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ children }) => {
  // Force background to black to ensure consistency
  useEffect(() => {
    document.body.style.backgroundColor = '#000';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <motion.div 
      className="relative min-h-screen w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ perspective: "1000px" }}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxBackground;
