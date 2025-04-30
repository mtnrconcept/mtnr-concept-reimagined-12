
import React, { useRef, useEffect, useState } from 'react';
import { ElevatorTransitionProps } from './ElevatorTypes';
import { useElevatorTransition } from './useElevatorTransition';

const ElevatorTransition: React.FC<ElevatorTransitionProps> = ({
  children,
  isActive,
  onAnimationComplete
}) => {
  const {
    direction,
    exitContent,
    enterContent,
    isTransitioning
  } = useElevatorTransition({
    isActive,
    onAnimationComplete,
    currentPath: children
  });

  const [animationStarted, setAnimationStarted] = useState(false);
  const prevTransitionRef = useRef<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // On ne démarre l'animation que si isTransitioning vient de passer à true
    if (!prevTransitionRef.current && isTransitioning) {
      setAnimationStarted(true);
      
      // Déclencher la fin de l'animation après 7 secondes (2s sortie + 3s vidéo + 2s entrée)
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = window.setTimeout(() => {
        setAnimationStarted(false);
        onAnimationComplete();
      }, 7000); // Durée totale: 7s
    }

    // Si la transition s'arrête (retour à false), on reset notre flag
    if (!isTransitioning && animationStarted) {
      setAnimationStarted(false);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
    
    prevTransitionRef.current = isTransitioning;
    
    // Nettoyage
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [isTransitioning, animationStarted, onAnimationComplete]);

  if (!isTransitioning && !animationStarted) {
    return (
      <div id="main-content" className="elevator-content">
        {children}
      </div>
    );
  }

  return (
    <div className="elevator-container">
      {/* Contenu sortant avec animation de sortie vers le haut */}
      <div 
        className={`elevator-content exit-content ${animationStarted ? 'animate-slide-out-up' : ''}`}
      >
        {exitContent}
      </div>

      {/* Contenu entrant avec animation d'entrée par le bas - 
           démarre après 5 secondes (2s sortie + 3s vidéo) */}
      <div 
        className={`elevator-content enter-content ${animationStarted ? 'animate-slide-in-up' : ''}`}
      >
        {enterContent}
      </div>
    </div>
  );
};

export default ElevatorTransition;
