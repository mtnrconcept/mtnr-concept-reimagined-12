
import React, { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackgroundVideo from './effects/BackgroundVideo';
import { useNavigation } from './effects/NavigationContext';
import { useLocation } from 'react-router-dom';

interface ParallaxBackgroundProps {
  children: ReactNode;
  videoUrl?: string;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ 
  children, 
  videoUrl = "/lovable-uploads/Video fond normale.mp4"
}) => {
  const navigation = useNavigation();
  const location = useLocation();

  // Déclencher la transition vidéo lors des changements de page
  useEffect(() => {
    // Déclencher la transition vidéo
    navigation.triggerVideoTransition();
    console.log("Changement de page détecté, transition vidéo déclenchée");
  }, [location.pathname, navigation]);

  return (
    <>
      {/* Vidéo d'arrière-plan */}
      <BackgroundVideo videoUrl={videoUrl} />
      
      <motion.div 
        className="relative min-h-screen w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ 
          perspective: "1000px",
          zIndex: 10
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default ParallaxBackground;
