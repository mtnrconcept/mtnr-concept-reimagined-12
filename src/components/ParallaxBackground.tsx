
import React, { ReactNode, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
  const [mounted, setMounted] = useState(false);
  
  // Valeurs pour le tracking de la souris
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Convertir le mouvement de souris en effet spring avec amortissement
  const springConfig = { damping: 25, stiffness: 120 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  // Transformer les coordonnées de la souris en rotations de perspective
  const rotateX = useTransform(springY, [-300, 300], [5, -5]);
  const rotateY = useTransform(springX, [-300, 300], [-5, 5]);
  
  // Effet de perspective plus profond pour les éléments enfants
  const childrenX = useTransform(springX, [-300, 300], [15, -15]);
  const childrenY = useTransform(springY, [-300, 300], [-15, 15]);
  
  // Déclencher la transition vidéo lors des changements de page
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    
    console.log("Changement de route détecté, déclenchement de la transition vidéo");
    const timer = setTimeout(() => {
      navigation.triggerVideoTransition();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname, navigation, mounted]);
  
  // Effet pour suivre la position de la souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculer la position relative au centre de la fenêtre
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div 
      className="relative min-h-screen w-full overflow-hidden"
      style={{ 
        perspective: "1200px",
        zIndex: 10
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          transformOrigin: "center center"
        }}
      >
        {/* Couche de fond avec effet 3D */}
        <motion.div 
          className="absolute inset-0 z-0" 
          style={{
            translateZ: "-50px",
            scale: 1.1,  // Légère échelle pour éviter les bords vides en rotation
          }}
        />
        
        {/* Couche de contenu avec effet 3D plus prononcé */}
        <motion.div 
          className="relative z-10"
          style={{
            rotateX: childrenY,
            rotateY: childrenX,
            transformStyle: "preserve-3d",
            transformOrigin: "center center"
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ParallaxBackground;
