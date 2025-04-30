
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
  
  // If transition not active, simply display content
  if (!isTransitioning) {
    return <>{children}</>;
  }

  return (
    <div className="elevator-container">
      {/* Exit content animation with repetile effect */}
      {exitContent && (
        <div
          className={`elevator-content exit-content ${
            repetileActive 
              ? direction === 'down' ? 'repetile-up' : 'repetile-down'
              : direction === 'down' ? 'slide-out-up' : 'slide-out-down'
          }`}
          style={{
            // Apply different style for the last animation
            animationIterationCount: repetileActive ? maxLoops : 1
          }}
        >
          {exitContent}
        </div>
      )}
      
      {/* Enter content animation (only after repetile ends) */}
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
