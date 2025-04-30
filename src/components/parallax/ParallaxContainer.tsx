
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Background from './Background';

interface ParallaxContainerProps {
  children: ReactNode;
}

export const ParallaxContainer = ({ children }: ParallaxContainerProps) => {
  return (
    <div className="relative w-full h-full">
      <Background />
      <motion.div
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxContainer;
