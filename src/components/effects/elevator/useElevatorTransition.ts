
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UseElevatorTransitionProps, UseElevatorTransitionReturn } from './ElevatorTypes';

export function useElevatorTransition({
  isActive,
  onAnimationComplete,
  currentPath
}: UseElevatorTransitionProps): UseElevatorTransitionReturn {
  const location = useLocation();
  const [exitContent, setExitContent] = useState<React.ReactNode | null>(null);
  const [enterContent, setEnterContent] = useState<React.ReactNode | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [prevPath, setPrevPath] = useState(location.pathname);
  
  // Effet pour détecter les changements de route
  useEffect(() => {
    // Si l'état isActive change de false à true, c'est une transition
    if (isActive && !isTransitioning) {
      console.log("Transition activée: début du fondu entre pages");
      setIsTransitioning(true);
      
      // Conserver le contenu actuel comme contenu de sortie
      setExitContent(currentPath);
      
      // Mettre à jour le contenu d'entrée (le même que le contenu actuel pour l'instant)
      setEnterContent(currentPath);
      
      // Enregistrer le chemin cible pour plus tard
      setPrevPath(location.pathname);
    }
    
    // Si isActive devient false, réinitialiser
    if (!isActive && isTransitioning) {
      setIsTransitioning(false);
      setExitContent(null);
      setEnterContent(null);
    }
  }, [isActive, location.pathname, currentPath, isTransitioning, prevPath]);

  return {
    exitContent,
    enterContent,
    contentEntranceDelay: 0,
    isTransitioning,
    direction: null
  };
}
