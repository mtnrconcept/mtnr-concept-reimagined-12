
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TransitionDirection, UseElevatorTransitionProps, UseElevatorTransitionReturn } from './ElevatorTypes';
import { useBackgroundVideoStore } from '../BackgroundVideoController';

// Définition de l'ordre des pages pour déterminer la direction
const pageOrder = ['/', '/what-we-do', '/artists', '/book', '/contact'];

// Configuration des timings exactement comme dans l'exemple fourni
const REPETILE_DURATION = 1500; // 1.5s par cycle repetile
const MAX_LOOPS = 4; // Nombre de boucles avant le slide final
const REPETILE_TOTAL_DURATION = REPETILE_DURATION * MAX_LOOPS; // 6s en tout
const FINAL_SLIDE_DURATION = 1000; // 1s pour le slide final

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
  const [repetileActive, setRepetileActive] = useState<boolean>(false);
  const [finalSlideActive, setFinalSlideActive] = useState<boolean>(false);
  const [loopCount, setLoopCount] = useState<number>(0);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const finalSlideTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Accès au store vidéo
  const { startVideo, pauseVideo } = useBackgroundVideoStore();
  
  // Determine content entrance delay
  const contentEntranceDelay = 0;
  const maxLoops = MAX_LOOPS;
  
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
      
      // Activer l'effet repetile
      setRepetileActive(true);
      setFinalSlideActive(false);
      setLoopCount(0);
      
      // Démarrer la vidéo en arrière-plan dans la bonne direction
      // Comme dans l'exemple fourni: forward = vers le bas, reverse = vers le haut
      startVideo(transitionDirection === 'down' ? 'forward' : 'reverse');
      
      // Planifier la transition finale après les boucles repetile (6s exactement)
      finalSlideTimerRef.current = setTimeout(() => {
        console.log("Fin des répétitions repetile après 6s, passage à la transition finale");
        setRepetileActive(false);
        setFinalSlideActive(true);
        
        // Après la durée du slide final (1s), on considère la transition terminée
        setTimeout(() => {
          onAnimationComplete();
          setIsTransitioning(false);
          setFinalSlideActive(false);
          pauseVideo(); // Mettre la vidéo en pause à la fin, comme dans l'exemple
        }, FINAL_SLIDE_DURATION);
      }, REPETILE_TOTAL_DURATION);
    }
    
    // Si isActive devient false, réinitialiser
    if (!isActive && isTransitioning) {
      setIsTransitioning(false);
      setExitContent(null);
      setEnterContent(null);
      setDirection(null);
      setTargetPath(null);
      setRepetileActive(false);
      setFinalSlideActive(false);
      setLoopCount(0);
      
      // Nettoyer les timers si nécessaire
      if (loopTimerRef.current) {
        clearTimeout(loopTimerRef.current);
        loopTimerRef.current = null;
      }
      
      if (finalSlideTimerRef.current) {
        clearTimeout(finalSlideTimerRef.current);
        finalSlideTimerRef.current = null;
      }
    }
  }, [isActive, location.pathname, currentPath, isTransitioning, prevPath, startVideo, pauseVideo]);
  
  // Simulation de comptage des boucles repetile pour le debugging
  useEffect(() => {
    if (!repetileActive) return;
    
    // Incrémenter le compteur de boucles après chaque cycle
    loopTimerRef.current = setTimeout(() => {
      setLoopCount(prev => {
        const nextCount = prev + 1;
        console.log(`Répétition repetile ${nextCount}/${MAX_LOOPS}`);
        return nextCount;
      });
    }, REPETILE_DURATION);
    
    return () => {
      if (loopTimerRef.current) {
        clearTimeout(loopTimerRef.current);
        loopTimerRef.current = null;
      }
    };
  }, [repetileActive, loopCount]);
  
  // Nettoyage des timers lors du démontage
  useEffect(() => {
    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
      if (finalSlideTimerRef.current) clearTimeout(finalSlideTimerRef.current);
    };
  }, []);

  return {
    direction,
    exitContent,
    enterContent,
    contentEntranceDelay,
    isTransitioning,
    repetileActive,
    loopCount,
    maxLoops,
    finalSlideActive
  };
}
