
import React from 'react';
import { ElevatorTransitionProps } from './ElevatorTypes';
import { useElevatorTransition } from './useElevatorTransition';

const ElevatorTransition = ({ children, isActive, onAnimationComplete }: ElevatorTransitionProps) => {
  const { 
    direction, 
    exitContent, 
    enterContent,
    contentEntranceDelay,
    isTransitioning,
    repetileActive,
    loopCount,
    maxLoops
  } = useElevatorTransition({
    isActive,
    onAnimationComplete,
    currentPath: children
  });
  
  // Si la transition n'est pas active, on affiche simplement le contenu
  if (!isTransitioning) {
    return <>{children}</>;
  }

  return (
    <div className="elevator-container">
      {/* Animation de sortie du contenu actuel avec effet repetile */}
      {exitContent && (
        <div
          className={`elevator-content exit-content ${
            repetileActive 
              ? direction === 'down' ? 'repetile-up' : 'repetile-down'
              : direction === 'down' ? 'slide-out-up' : 'slide-out-down'
          }`}
          style={{
            // Appliquer un style différent pour la dernière animation
            animationIterationCount: repetileActive ? maxLoops : 1
          }}
        >
          {exitContent}
        </div>
      )}
      
      {/* Animation d'entrée du nouveau contenu (seulement après la fin de repetile) */}
      {enterContent && !repetileActive && loopCount >= maxLoops && (
        <div
          className={`elevator-content enter-content ${
            direction === 'down' ? 'slide-in-up' : 'slide-in-down'
          }`}
          style={{
            animationDelay: `${contentEntranceDelay}ms`
          }}
        >
          {enterContent}
        </div>
      )}
    </div>
  );
};

export default ElevatorTransition;
