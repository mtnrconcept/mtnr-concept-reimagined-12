
import React, { useRef, useEffect, useState } from 'react';
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
  const [exitContent, setExitContent] = useState<React.ReactNode | null>(null);
  const [enterContent, setEnterContent] = useState<React.ReactNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Configuration des timings
  const videoTransitionDuration = 5000; // 5 secondes pour la vidéo complète
  const exitAnimationDuration = 4.0; // Durée de sortie en secondes
  const enterAnimationDuration = 2.5; // Durée d'entrée en secondes
  const contentEntranceDelay = videoTransitionDuration - (enterAnimationDuration * 1000); // Le contenu apparaît pendant les dernières 2.5 secondes
  
  // Détermine la direction de l'animation basée sur l'ordre des pages
  useEffect(() => {
    if (!isActive) return;
    
    const currentIndex = pageOrder.indexOf(location.pathname);
    const prevIndex = pageOrder.indexOf(prevPath);
    
    console.log(`Transition de: ${prevPath} (${prevIndex}) vers ${location.pathname} (${currentIndex})`);
    
    if (currentIndex > prevIndex) {
      console.log('Direction: descente');
      setDirection('down');
    } else if (currentIndex < prevIndex) {
      console.log('Direction: montée');
      setDirection('up');
    } else {
      console.log('Même page, pas de direction spécifique');
      setDirection(null);
    }
  }, [isActive, location.pathname, prevPath]);

  // Mettre à jour le contenu de sortie et d'entrée
  useEffect(() => {
    if (isActive) {
      // Enregistrer le contenu actuel comme contenu de sortie
      setExitContent(children);
      setEnterContent(null);
      
      // Après un court délai, mettre à jour le contenu d'entrée
      const timeout = setTimeout(() => {
        setEnterContent(children);
      }, contentEntranceDelay);
      
      return () => clearTimeout(timeout);
    } else {
      setExitContent(null);
      setEnterContent(null);
    }
  }, [isActive, children, contentEntranceDelay]);

  // Gestion de la lecture vidéo
  useEffect(() => {
    if (!isActive || !videoRef.current) return;
    
    const video = videoRef.current;
    
    // Configuration de la vidéo en fonction de la direction
    if (direction === 'down') {
      // Pour descendre, on joue la vidéo normalement depuis le début
      video.currentTime = 0;
      video.classList.remove('video-reversed');
    } else if (direction === 'up') {
      // Pour monter, on utilise l'effet CSS pour inverser la vidéo verticalement
      video.currentTime = 0;
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
      setPrevPath(location.pathname);
      onAnimationComplete();
    }, videoTransitionDuration);
    
    return () => clearTimeout(timeoutId);
  }, [isActive, direction, onAnimationComplete, videoTransitionDuration, location.pathname]);

  return (
    <div className="elevator-container" ref={containerRef}>
      {isActive && (
        <>
          {/* Video Background */}
          <div className="elevator-video-container">
            <video 
              ref={videoRef} 
              className={`elevator-video ${direction === 'up' ? 'video-reversed' : ''} blur-motion`}
              src="/lovable-uploads/ascensceur.mp4"
              muted
              playsInline
            />
          </div>
          
          {/* Animation de sortie du contenu actuel */}
          {exitContent && (
            <div
              className={`elevator-content exit-content ${
                direction === 'down' ? 'slide-out-up' : 
                direction === 'up' ? 'slide-out-down' : ''
              }`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            >
              {exitContent}
            </div>
          )}
          
          {/* Animation d'entrée du nouveau contenu */}
          {enterContent && (
            <div
              className={`elevator-content enter-content ${
                direction === 'down' ? 'slide-in-up' : 
                direction === 'up' ? 'slide-in-down' : ''
              }`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%", 
                height: "100%",
                animationDelay: `${contentEntranceDelay / 1000}s`
              }}
            >
              {enterContent}
            </div>
          )}
        </>
      )}
      
      {/* Contenu normal lorsque la transition n'est pas active */}
      {!isActive && children}
    </div>
  );
};

export default ElevatorTransition;
