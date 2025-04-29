
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TransitionDirection, UseElevatorTransitionProps, UseElevatorTransitionReturn } from './ElevatorTypes';

// Définition de l'ordre des pages pour déterminer la direction
const pageOrder = ['/', '/what-we-do', '/artists', '/book', '/contact'];

// Configuration des timings
const VIDEO_DURATION = 5000; // 5 secondes pour la vidéo complète
const EXIT_ANIMATION_DURATION = 4.0; // Durée de sortie en secondes
const ENTER_ANIMATION_DURATION = 2.5; // Durée d'entrée en secondes

export function useElevatorTransition({
  isActive,
  onAnimationComplete,
  videoRef,
  currentPath
}: UseElevatorTransitionProps): UseElevatorTransitionReturn {
  const location = useLocation();
  const [direction, setDirection] = useState<TransitionDirection>(null);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const [exitContent, setExitContent] = useState<React.ReactNode | null>(null);
  const [enterContent, setEnterContent] = useState<React.ReactNode | null>(null);
  
  // Calculated timing values
  const contentEntranceDelay = VIDEO_DURATION - (ENTER_ANIMATION_DURATION * 1000);
  
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
      setExitContent(currentPath);
      setEnterContent(null);
      
      // Après un court délai, mettre à jour le contenu d'entrée
      const timeout = setTimeout(() => {
        setEnterContent(currentPath);
      }, contentEntranceDelay);
      
      return () => clearTimeout(timeout);
    } else {
      setExitContent(null);
      setEnterContent(null);
    }
  }, [isActive, currentPath, contentEntranceDelay]);

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
    }, VIDEO_DURATION);
    
    return () => clearTimeout(timeoutId);
  }, [isActive, direction, onAnimationComplete, location.pathname, videoRef]);

  return {
    direction,
    exitContent,
    enterContent,
    contentEntranceDelay,
  };
}
