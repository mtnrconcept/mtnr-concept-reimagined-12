
import React from 'react';
import { motion } from 'framer-motion';

const ParallaxDecorations: React.FC = () => {
  return (
    <>
      <motion.div 
        className="absolute top-[10%] right-[10%] w-32 h-32 rounded-full bg-yellow-400 opacity-30 blur-lg"
        animate={{ 
          x: [0, 10, -10, 0],
          y: [0, -10, 10, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut"
        }}
        style={{ zIndex: 1, filter: "blur(40px)" }}
      />
      
      <motion.div 
        className="absolute bottom-[15%] left-[15%] w-40 h-40 rounded-full bg-yellow-500 opacity-20 blur-xl"
        animate={{ 
          x: [0, -15, 15, 0],
          y: [0, 15, -15, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 25,
          ease: "easeInOut"
        }}
        style={{ zIndex: 1, filter: "blur(50px)" }}
      />
    </>
  );
};

export default ParallaxDecorations;
