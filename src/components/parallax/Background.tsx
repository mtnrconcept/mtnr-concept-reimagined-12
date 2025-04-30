
import React from 'react';
import { motion } from 'framer-motion';
import { useVideoStore } from '@/components/effects/BackgroundVideoManager';

// Background component for the parallax effect
const Background = () => {
  // Access the video store
  const videoStore = useVideoStore();

  return (
    <motion.div 
      className="fixed inset-0 z-0 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Background content can be added here */}
    </motion.div>
  );
};

export default Background;
