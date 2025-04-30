
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import BackgroundVideo from './effects/BackgroundVideo';

interface ParallaxBackgroundProps {
  children: ReactNode;
  videoUrl?: string;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ 
  children, 
  videoUrl = "/lovable-uploads/Video fond normale.mp4"
}) => {
  return (
    <>
      {/* Vidéo d'arrière-plan */}
      <BackgroundVideo videoUrl={videoUrl} />
      
      <motion.div 
        className="relative min-h-screen w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ perspective: "1000px" }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default ParallaxBackground;
