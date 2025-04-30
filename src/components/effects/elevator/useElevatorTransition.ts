
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TransitionDirection, UseElevatorTransitionProps, UseElevatorTransitionReturn } from './ElevatorTypes';
import { useBackgroundVideoStore } from '../BackgroundVideoController';

// Définition de l'ordre des pages pour déterminer la direction
const pageOrder = ['/', '/what-we-do', '/artists', '/book', '/contact'];

// Configuration des timings comme dans l'exemple fourni
const REPETILE_DURATION = 6000;     // 6s pour l'animation complète
const FINAL_SLIDE_DURATION = 1000;  // 1s pour le slide final

export function useElevatorTransition({
  isActive,
  onAnimationComplete,
  currentPath
}: UseElevatorTransitionProps): UseElevatorTransitionReturn {
  const location = useLocation();
  const [direction, setDirection] = useState<TransitionDirection>(null);
  const [exitContent, setExitContent] = useState<React.ReactNode | null>(null);
  const [enterContent, setEnterContent] = useState<React.ReactNode | null>(null);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const finalSlideTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Accès au store vidéo
  const { startVideo, pauseVideo } = useBackgroundVideoStore();
  
  // Determine content entrance delay
  const contentEntranceDelay = 0;
  
  // Effet pour détecter les changements de route
  useEffect(() => {
    // Si l'état isActive change de false à true, c'est une transition
    if (isActive && !isTransitioning) {
      setIsTransitioning(true);
      
      // Déterminer la direction en fonction de l'ordre des pages
      const currentIndex = pageOrder.indexOf(prevPath);
      const newIndex = pageOrder.indexOf(location.pathname);
      
      console.log(`Transition de: ${prevPath} (${currentIndex}) vers ${location.pathname} (${newIndex})`);
      
      let transitionDirection: TransitionDirection = 'down';
      
      if (newIndex > currentIndex) {
        transitionDirection = 'down';
      } else if (newIndex < currentIndex) {
        transitionDirection = 'up';
      }
      
      setDirection(transitionDirection);
      
      // Conserver le contenu actuel comme contenu de sortie
      setExitContent(currentPath);
      
      // Mettre à jour le contenu d'entrée (le même que le contenu actuel pour l'instant)
      // Sera mis à jour après la navigation
      setEnterContent(currentPath);
      
      // Enregistrer le chemin cible pour plus tard
      setTargetPath(location.pathname);
      setPrevPath(location.pathname);
      
      // Démarrer la vidéo en arrière-plan dans la bonne direction
      startVideo(transitionDirection === 'down' ? 'forward' : 'reverse');
    }
    
    // Si isActive devient false, réinitialiser
    if (!isActive && isTransitioning) {
      setIsTransitioning(false);
      setExitContent(null);
      setEnterContent(null);
      setDirection(null);
      setTargetPath(null);
      
      // Nettoyer les timers si nécessaire
      if (finalSlideTimerRef.current) {
        clearTimeout(finalSlideTimerRef.current);
        finalSlideTimerRef.current = null;
      }
    }
  }, [isActive, location.pathname, currentPath, isTransitioning, prevPath, startVideo]);
  
  // Nettoyage des timers lors du démontage
  useEffect(() => {
    return () => {
      if (finalSlideTimerRef.current) clearTimeout(finalSlideTimerRef.current);
    };
  }, []);

  return {
    direction,
    exitContent,
    enterContent,
    contentEntranceDelay,
    isTransitioning
  };
}
