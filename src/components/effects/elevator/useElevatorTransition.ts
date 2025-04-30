
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TransitionDirection, UseElevatorTransitionProps, UseElevatorTransitionReturn, AnimationPhase } from './ElevatorTypes';

// Définition de l'ordre des pages pour déterminer la direction
const pageOrder = ['/', '/what-we-do', '/artists', '/book', '/contact'];

// Configuration des timings (en millisecondes)
const LOOP_DURATION_BASE = 2400; // 2.4s pour la première boucle
const LOOP_DURATION_DECREMENT = 400; // Diminution du temps par boucle
const LOOP_MIN_DURATION = 1000; // Durée minimale d'une boucle (1s)
const SLIDE_ANIMATION_DURATION = 1000; // 1 seconde pour l'animation finale de slide
const CONTENT_ENTRANCE_DELAY = 0; // Démarrage immédiat de l'animation d'entrée
const MAX_LOOPS = 5; // Nombre maximum de boucles avant la transition finale

export function useElevatorTransition({
  isActive,
  onAnimationComplete,
  videoRef,
  currentPath
}: UseElevatorTransitionProps): UseElevatorTransitionReturn {
  const location = useLocation();
  const [direction, setDirection] = useState<TransitionDirection>(null);
  const [exitContent, setExitContent] = useState<React.ReactNode | null>(null);
  const [enterContent, setEnterContent] = useState<React.ReactNode | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>(null);
  const [loopCount, setLoopCount] = useState(0);
  const [maxLoops, setMaxLoops] = useState(MAX_LOOPS);
  const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalTransitionTimeRef = useRef(0);
  
  // Determine content entrance delay
  const contentEntranceDelay = CONTENT_ENTRANCE_DELAY;
  
  // Effet pour détecter les changements de route
  useEffect(() => {
    // Si l'état isActive change de false à true, c'est une transition
    if (isActive && !isTransitioning) {
      console.log("Démarrage de la transition avec effet repetile");
      setIsTransitioning(true);
      setAnimationPhase('loop');
      setLoopCount(0);
      
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
      setEnterContent(currentPath);
      
      // Enregistrer le chemin actuel
      setPrevPath(location.pathname);

      // Planifier les boucles d'intensité croissante
      startProgressiveLoops();
    }
    
    // Si isActive devient false, réinitialiser
    if (!isActive && isTransitioning) {
      cleanupTransition();
    }
  }, [isActive, location.pathname, currentPath, isTransitioning, prevPath]);
  
  // Fonction pour démarrer les boucles progressives
  const startProgressiveLoops = () => {
    // Arrêter toute boucle en cours
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
    }
    
    totalTransitionTimeRef.current = 0;
    let currentLoopCount = 0;
    
    // Mettre la vidéo en pause au début
    if (videoRef.current) {
      videoRef.current.pause();
    }
    
    // Configurer une boucle pour incrémenter l'intensité
    loopIntervalRef.current = setInterval(() => {
      // Incrémenter le compteur de boucles
      currentLoopCount++;
      setLoopCount(currentLoopCount);
      
      // Calculer la durée de cette boucle
      const loopDuration = Math.max(
        LOOP_DURATION_BASE - (currentLoopCount * LOOP_DURATION_DECREMENT),
        LOOP_MIN_DURATION
      );
      
      // Ajouter à la durée totale de transition
      totalTransitionTimeRef.current += loopDuration;
      
      console.log(`Boucle repetile ${currentLoopCount}/${MAX_LOOPS}, durée: ${loopDuration}ms`);
      
      // Si on atteint le nombre maximal de boucles, passer à la phase de slide
      if (currentLoopCount >= MAX_LOOPS) {
        if (loopIntervalRef.current) {
          clearInterval(loopIntervalRef.current);
          loopIntervalRef.current = null;
        }
        
        // Passer à la phase de slide après la dernière boucle
        console.log("Phase de boucle terminée, passage à la phase de slide");
        setAnimationPhase('slide');
        
        // Démarrer la vidéo pour la transition finale
        if (videoRef.current) {
          // Configuration de la vidéo en fonction de la direction
          if (direction === 'down') {
            // Pour descendre, on joue la vidéo normalement depuis le début
            videoRef.current.currentTime = 0;
            videoRef.current.playbackRate = 1;
          } else if (direction === 'up') {
            // Pour monter, on inverse la lecture (via transformation CSS)
            videoRef.current.currentTime = 0;
            videoRef.current.playbackRate = 1;
          }
          
          // Démarrer la lecture
          const playPromise = videoRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error('Erreur de lecture vidéo:', error);
            });
          }
        }
        
        // Terminer la transition après la durée de l'animation de slide
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.pause();
          }
          
          // Signaler que l'animation est terminée
          onAnimationComplete();
          cleanupTransition();
        }, SLIDE_ANIMATION_DURATION);
      }
    }, LOOP_DURATION_BASE - (currentLoopCount * LOOP_DURATION_DECREMENT)); // Durée adaptative pour chaque boucle
  };
  
  // Nettoyer la transition
  const cleanupTransition = () => {
    // Arrêter les boucles
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
    
    // Réinitialiser les états
    setIsTransitioning(false);
    setExitContent(null);
    setEnterContent(null);
    setDirection(null);
    setAnimationPhase(null);
    setLoopCount(0);
  };
  
  // Nettoyage lors du démontage du composant
  useEffect(() => {
    return () => {
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
      }
    };
  }, []);

  return {
    direction,
    exitContent,
    enterContent,
    contentEntranceDelay,
    isTransitioning,
    animationPhase,
    loopCount,
    maxLoops
  };
}
