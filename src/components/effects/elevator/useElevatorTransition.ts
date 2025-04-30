
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TransitionDirection, UseElevatorTransitionProps, UseElevatorTransitionReturn } from './ElevatorTypes';
import { useBackgroundVideoStore } from '../BackgroundVideoController';

// Configuration des timings pour l'animation simplifiée
const ANIMATION_TOTAL_DURATION = 2000;  // 2s pour l'animation complète (1s fade-out + 1s fade-in)

export function useElevatorTransition({
  isActive,
  onAnimationComplete,
  currentPath
}: UseElevatorTransitionProps): UseElevatorTransitionReturn {
  const location = useLocation();
  const [direction, setDirection] = useState<TransitionDirection>(null);
  const [exitContent, setExitContent] = useState<React.ReactNode | null>(null);
  const [enterContent, setEnterContent] = useState<React.ReactNode | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [prevPath, setPrevPath] = useState(location.pathname);
  
  // Accès au store vidéo
  const { startVideo, pauseVideo } = useBackgroundVideoStore();
  
  // Determine content entrance delay
  const contentEntranceDelay = 0;
  
  // Effet pour détecter les changements de route
  useEffect(() => {
    // Si l'état isActive change de false à true, c'est une transition
    if (isActive && !isTransitioning) {
      setIsTransitioning(true);
      
      // Déterminer une direction simple (down par défaut)
      const transitionDirection: TransitionDirection = 'down';
      setDirection(transitionDirection);
      
      // Conserver le contenu actuel comme contenu de sortie
      setExitContent(currentPath);
      
      // Mettre à jour le contenu d'entrée (le même que le contenu actuel pour l'instant)
      // Sera mis à jour après la navigation
      setEnterContent(currentPath);
      
      // Enregistrer le chemin cible pour plus tard
      setPrevPath(location.pathname);
      
      // Démarrer la vidéo en arrière-plan
      startVideo('forward');
      
      console.log(`Animation de fondu simplifiée: ${ANIMATION_TOTAL_DURATION}ms`);
    }
    
    // Si isActive devient false, réinitialiser
    if (!isActive && isTransitioning) {
      setIsTransitioning(false);
      setExitContent(null);
      setEnterContent(null);
      setDirection(null);
      
      // Pause de la vidéo si elle joue encore
      pauseVideo();
    }
  }, [isActive, location.pathname, currentPath, isTransitioning, prevPath, startVideo, pauseVideo]);

  return {
    direction,
    exitContent,
    enterContent,
    contentEntranceDelay,
    isTransitioning
  };
}
