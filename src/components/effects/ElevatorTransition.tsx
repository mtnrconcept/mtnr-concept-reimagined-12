
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { safeBlur } from '@/lib/animation-utils';

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
  const [currentContent, setCurrentContent] = useState<React.ReactNode>(children);
  
  // Configuration des timings
  const videoTransitionDuration = 5000; // 5 secondes pour la vidéo complète
  const exitAnimationDuration = 4.0; // Durée de sortie en secondes
  const enterAnimationDuration = 2.5; // Durée d'entrée en secondes
  const contentEntranceDelay = videoTransitionDuration - (enterAnimationDuration * 1000); // Le contenu apparaît pendant les dernières 2.5 secondes
  
  // Met à jour le contenu actuel lorsque les enfants changent et que la transition n'est pas active
  useEffect(() => {
    if (!isActive) {
      setCurrentContent(children);
    }
  }, [children, isActive]);
  
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
    
    const video = videoRef.current;
    
    // Configuration de la vidéo en fonction de la direction
    if (direction === 'down') {
      // Pour descendre, on joue la vidéo normalement depuis le début
      video.currentTime = 0;
      video.playbackRate = 1;
      video.classList.remove('video-reversed');
    } else if (direction === 'up') {
      // Pour monter, on utilise l'effet CSS pour inverser la vidéo verticalement
      video.currentTime = 0;
      video.playbackRate = 1;
      video.classList.add('video-reversed');
    }
    
    // Démarrer la lecture
    const playPromise = video.play();
    
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
        videoRef.current.classList.remove('video-reversed');
      }
      // Signal que l'animation est terminée
      onAnimationComplete();
    }, videoTransitionDuration);
    
    return () => clearTimeout(timeoutId);
  }, [isActive, direction, onAnimationComplete, videoTransitionDuration]);

  // Variantes d'animation pour le contenu sortant
  const exitVariants = {
    initial: { y: 0, opacity: 1 },
    animate: (direction: 'up' | 'down' | null) => ({
      y: direction === 'down' ? '-100vh' : direction === 'up' ? '100vh' : 0,
      opacity: 0,
      transition: {
        duration: exitAnimationDuration,
        ease: [0.25, 1, 0.5, 1], // Courbe d'ease-out (easy ease)
      }
    }),
  };

  // Variantes d'animation pour le nouveau contenu entrant
  const enterVariants = {
    initial: (direction: 'up' | 'down' | null) => ({
      y: direction === 'down' ? '100vh' : direction === 'up' ? '-100vh' : 0,
      opacity: 0
    }),
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: enterAnimationDuration,
        ease: [0.25, 1, 0.5, 1], // Courbe d'ease-out (easy ease)
      }
    },
  };

  return (
    <div className="elevator-container" ref={containerRef}>
      {isActive && (
        <>
          {/* Video Background */}
          <div className="elevator-video-container">
            <video 
              ref={videoRef} 
              className={`elevator-video ${direction === 'up' ? 'video-reversed' : ''}`}
              src="/lovable-uploads/ascensceur.mp4"
              muted
              playsInline
            />
          </div>
          
          {/* Animation de sortie du contenu actuel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`exit-${prevPath}`}
              className="elevator-content"
              custom={direction}
              variants={exitVariants}
              initial="initial"
              animate="animate"
            >
              {currentContent}
            </motion.div>
          </AnimatePresence>
          
          {/* Animation d'entrée du nouveau contenu avec délai */}
          <motion.div
            key={`enter-${location.pathname}`}
            className="elevator-content"
            custom={direction}
            variants={enterVariants}
            initial="initial"
            animate={isActive ? {
              y: 0,
              opacity: 1,
              transition: {
                delay: contentEntranceDelay / 1000,
                duration: enterAnimationDuration,
                ease: [0.25, 1, 0.5, 1], // Courbe d'ease-out (easy ease)
              }
            } : "initial"}
            style={{ display: !isActive ? 'none' : 'flex' }}
          >
            {children}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ElevatorTransition;
