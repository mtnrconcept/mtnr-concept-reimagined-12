
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Définition de l'ordre des pages pour déterminer la direction
const pageOrder = ['/', '/what-we-do', '/artists', '/book', '/contact'];

interface ElevatorTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
  onAnimationComplete: () => void;
}

const ElevatorTransition = ({ children, isActive, onAnimationComplete }: ElevatorTransitionProps) => {
  const location = useLocation();
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Délais pour la synchronisation des animations
  const videoTransitionDuration = 5000; // 5 secondes pour la vidéo
  const contentEntranceDelay = 4000; // Le contenu apparaît 1 seconde avant la fin
  
  // Détermine la direction de l'animation basée sur l'ordre des pages
  useEffect(() => {
    if (!isActive) return;
    
    const currentIndex = pageOrder.indexOf(location.pathname);
    const prevIndex = pageOrder.indexOf(prevPath);
    
    if (currentIndex > prevIndex) {
      setDirection('down');
    } else if (currentIndex < prevIndex) {
      setDirection('up');
    } else {
      setDirection(null);
    }
    
    setPrevPath(location.pathname);
  }, [isActive, location.pathname, prevPath]);

  // Gestion de la lecture vidéo
  useEffect(() => {
    if (!isActive || !videoRef.current) return;
    
    // Mettre la vidéo au début ou à la fin selon la direction
    if (direction === 'down') {
      videoRef.current.currentTime = 0;
    } else if (direction === 'up') {
      // Pour l'animation vers le haut, nous inversons la vidéo en la lisant à l'envers
      // en commençant de la fin
      videoRef.current.currentTime = videoRef.current.duration || 0;
      videoRef.current.playbackRate = -1;
    }
    
    // Démarrer la lecture
    const playPromise = videoRef.current.play();
    
    // Gérer les erreurs potentielles de lecture
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Erreur de lecture vidéo:', error);
      });
    }
    
    // Arrêter la vidéo à la fin de la transition
    const timeoutId = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      // Signal que l'animation est terminée
      onAnimationComplete();
    }, videoTransitionDuration);
    
    return () => clearTimeout(timeoutId);
  }, [isActive, direction, onAnimationComplete]);

  // Variantes d'animation pour le contenu
  const contentVariants = {
    initial: (direction: 'up' | 'down' | null) => ({
      y: direction === 'down' ? '-100vh' : direction === 'up' ? '100vh' : 0,
      opacity: 0
    }),
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        delay: contentEntranceDelay / 1000, // Convertir en secondes
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Ease-out quint
      }
    },
    exit: (direction: 'up' | 'down' | null) => ({
      y: direction === 'down' ? '100vh' : direction === 'up' ? '-100vh' : 0,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: [0.7, 0, 0.84, 0], // Ease-in quint
      }
    }),
  };

  // Effet de flou appliqué séparément pour éviter les problèmes de types de keyframes
  const BlurMotionEffect = ({ children }: { children: React.ReactNode }) => {
    return (
      <motion.div
        initial={{ filter: "blur(0px)" }}
        animate={{
          filter: [
            "blur(0px)",
            "blur(8px)",
            "blur(12px)",
            "blur(8px)",
            "blur(0px)"
          ]
        }}
        transition={{
          duration: 5,
          times: [0, 0.2, 0.5, 0.8, 1],
          ease: [0.16, 1, 0.3, 1]
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden" ref={containerRef}>
      {isActive && (
        <>
          {/* Video Background */}
          <div className="absolute inset-0 bg-black">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover"
              src="/lovable-uploads/ascensceur.mp4"
              muted
              playsInline
            />
          </div>
          
          <motion.div
            custom={direction}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 flex items-center justify-center"
          >
            <BlurMotionEffect>
              <div className="bg-black bg-opacity-70 backdrop-blur-md p-6 rounded-lg">
                {children}
              </div>
            </BlurMotionEffect>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ElevatorTransition;
