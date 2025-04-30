
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TransitionDirection, UseElevatorTransitionProps, UseElevatorTransitionReturn } from './ElevatorTypes';
import { useBackgroundVideoStore } from '../BackgroundVideoController';

// Configuration des timings pour l'animation simplifiée
const ANIMATION_TOTAL_DURATION = 7000;  // 7s pour l'animation complète (2s sortie + 3s vidéo + 2s entrée)

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
  
  // Effet pour détecter les changements de route
  useEffect(() => {
    // Si l'état isActive change de false à true, c'est une transition
    if (isActive && !isTransitioning) {
      setIsTransitioning(true);
      
      // Direction toujours vers le bas pour la cohérence
      setDirection('down');
      
      // Conserver le contenu actuel comme contenu de sortie
      setExitContent(currentPath);
      
      // Mettre à jour le contenu d'entrée (le même que le contenu actuel pour l'instant)
      setEnterContent(currentPath);
      
      setPrevPath(location.pathname);
      
      // Démarrer la vidéo en arrière-plan
      startVideo('forward');
      
      console.log(`Animation simplifiée: ${ANIMATION_TOTAL_DURATION}ms (2s sortie + 3s vidéo + 2s entrée)`);
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
    contentEntranceDelay: 5000, // 5s avant l'entrée du nouveau contenu (2s sortie + 3s vidéo)
    isTransitioning
  };
}
