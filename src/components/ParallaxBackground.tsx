
import React, { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from './effects/NavigationContext';
import { useLocation } from 'react-router-dom';

interface ParallaxBackgroundProps {
  children: ReactNode;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ 
  children
}) => {
  const navigation = useNavigation();
  const location = useLocation();

  // Déclencher la transition vidéo lors des changements de page
  useEffect(() => {
    // Déclencher la transition vidéo
    navigation.triggerVideoTransition();
    console.log("Changement de page détecté dans ParallaxBackground");
  }, [location.pathname, navigation]);

  return (
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
  );
};

export default ParallaxBackground;
