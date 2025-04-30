
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TransitionDirection, UseElevatorTransitionProps, UseElevatorTransitionReturn } from './ElevatorTypes';
import { useBackgroundVideoStore } from '../BackgroundVideoController';

export function useElevatorTransition({
  isActive,
  onAnimationComplete,
  currentPath
}: UseElevatorTransitionProps): UseElevatorTransitionReturn {
  const location = useLocation();
  const [direction] = useState<TransitionDirection>('down');
  const [exitContent, setExitContent] = useState<React.ReactNode | null>(null);
  const [enterContent, setEnterContent] = useState<React.ReactNode | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  
  // Effet pour détecter les changements de route
  useEffect(() => {
    if (isActive && !isTransitioning) {
      setIsTransitioning(true);
      
      // Conserver le contenu actuel
      setExitContent(currentPath);
      setEnterContent(currentPath);
      
      console.log('Transition démarrée');
    }
    
    if (!isActive && isTransitioning) {
      setIsTransitioning(false);
      setExitContent(null);
      setEnterContent(null);
      
      console.log('Transition réinitialisée');
    }
  }, [isActive, currentPath, isTransitioning, location.pathname]);

  return {
    direction,
    exitContent,
    enterContent,
    contentEntranceDelay: 5000, // 5s avant l'entrée du nouveau contenu
    isTransitioning
  };
}
