
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TransitionDirection, UseElevatorTransitionProps, UseElevatorTransitionReturn } from './ElevatorTypes';

// Définition de l'ordre des pages pour déterminer la direction
const pageOrder = ['/', '/what-we-do', '/artists', '/book', '/contact'];

// Configuration des timings (en millisecondes)
const VIDEO_DURATION = 7000; // 7 secondes pour la vidéo complète
const EXIT_ANIMATION_DURATION = 7000; // Durée de sortie en ms
const ENTER_ANIMATION_DELAY = 0; // Démarrage immédiat de l'animation d'entrée

export function useElevatorTransition({
  isActive,
  onAnimationComplete,
  videoRef,
  currentPath
}: UseElevatorTransitionProps): UseElevatorTransitionReturn {
  const location = useLocation();
  const navigate = useNavigate();
  const [direction, setDirection] = useState<TransitionDirection>(null);
  const [exitContent, setExitContent] = useState<React.ReactNode | null>(null);
  const [enterContent, setEnterContent] = useState<React.ReactNode | null>(null);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [prevPath, setPrevPath] = useState(location.pathname);
  
  // Determine content entrance delay
  const contentEntranceDelay = ENTER_ANIMATION_DELAY;
  
  // Effet pour détecter les changements de route
  useEffect(() => {
    // Si l'état isActive change de false à true, c'est une transition
    if (isActive && !isTransitioning) {
      setIsTransitioning(true);
      
      // Déterminer la direction en fonction de l'ordre des pages
      const currentIndex = pageOrder.indexOf(prevPath);
      const newIndex = pageOrder.indexOf(location.pathname);
      
      console.log(`Transition de: ${prevPath} (${currentIndex}) vers ${location.pathname} (${newIndex})`);
      
      if (newIndex > currentIndex) {
        setDirection('down');
      } else if (newIndex < currentIndex) {
        setDirection('up');
      } else {
        // Même page, pas de direction spécifique
        setDirection('down'); // Direction par défaut
      }
      
      // Conserver le contenu actuel comme contenu de sortie
      setExitContent(currentPath);
      
      // Mettre à jour le contenu d'entrée (le même que le contenu actuel pour l'instant)
      // Sera mis à jour après la navigation
      setEnterContent(currentPath);
      
      // Enregistrer le chemin cible pour plus tard
      setTargetPath(location.pathname);
      setPrevPath(location.pathname);
    }
    
    // Si isActive devient false, réinitialiser
    if (!isActive && isTransitioning) {
      setIsTransitioning(false);
      setExitContent(null);
      setEnterContent(null);
      setDirection(null);
      setTargetPath(null);
    }
  }, [isActive, location.pathname, currentPath, isTransitioning, prevPath]);
  
  // Gestion de la lecture vidéo
  useEffect(() => {
    if (!isTransitioning || !videoRef.current) return;
    
    const video = videoRef.current;
    
    // Configuration de la vidéo en fonction de la direction
    if (direction === 'down') {
      // Pour descendre, on joue la vidéo normalement depuis le début
      video.currentTime = 0;
      video.playbackRate = 1;
    } else if (direction === 'up') {
      // Pour monter, on inverse la lecture
      // Note: Certains navigateurs ne supportent pas les playbackRate négatifs
      // Donc on utilise l'effet CSS pour inverser la vidéo verticalement
      video.currentTime = 0;
      video.playbackRate = 1;
    }
    
    // Démarrer la lecture
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Erreur de lecture vidéo:', error);
      });
    }
    
    // Arrêter la vidéo et terminer l'animation après la durée fixée
    const timeoutId = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      
      // Signaler que l'animation est terminée
      onAnimationComplete();
      setIsTransitioning(false);
    }, VIDEO_DURATION);
    
    return () => clearTimeout(timeoutId);
  }, [isTransitioning, direction, onAnimationComplete, videoRef]);

  return {
    direction,
    exitContent,
    enterContent,
    contentEntranceDelay,
    isTransitioning
  };
}
