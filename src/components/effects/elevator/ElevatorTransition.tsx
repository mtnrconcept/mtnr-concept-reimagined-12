
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
    finalSlideActive,
    loopCount,
    maxLoops
  } = useElevatorTransition({
    isActive,
    onAnimationComplete,
    currentPath: children
  });
  
  // Si transition non active, simplement afficher le contenu
  if (!isTransitioning) {
    return <>{children}</>;
  }

  return (
    <div className="elevator-container">
      {/* Contenu en sortie avec animation repetile ou slide-out */}
      {exitContent && (
        <div
          className={`elevator-content exit-content ${
            repetileActive 
              ? direction === 'down' ? 'repetile-up' : 'repetile-down'
              : finalSlideActive
                ? direction === 'down' ? 'slide-out-up' : 'slide-out-down'
                : ''
          }`}
        >
          {exitContent}
        </div>
      )}
      
      {/* Contenu en entrée avec animation slide-in (seulement après repetile) */}
      {enterContent && finalSlideActive && (
        <div
          className={`elevator-content enter-content ${
            direction === 'down' ? 'slide-in-down' : 'slide-in-up'
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
