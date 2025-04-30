
import React, { useRef } from 'react';
import { ElevatorTransitionProps } from './ElevatorTypes';
import { useElevatorTransition } from './useElevatorTransition';

const ElevatorTransition = ({ children, isActive, onAnimationComplete }: ElevatorTransitionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { 
    direction, 
    exitContent, 
    enterContent, 
    contentEntranceDelay,
    isTransitioning,
    animationPhase
  } = useElevatorTransition({
    isActive,
    onAnimationComplete,
    videoRef,
    currentPath: children
  });
  
  // Si la transition n'est pas active, on affiche simplement le contenu
  if (!isTransitioning) {
    return <>{children}</>;
  }

  return (
    <div className="elevator-container" ref={containerRef}>
      {/* Conteneur Vidéo */}
      <div className="elevator-video-container">
        <video 
          ref={videoRef} 
          className={`elevator-video ${direction === 'up' ? 'video-reversed' : ''}`}
          src="/lovable-uploads/ascensceur.mp4"
          muted
          playsInline
        />
      </div>
      
      {/* Animation de sortie du contenu actuel */}
      {exitContent && (
        <div
          className={`elevator-content exit-content ${
            animationPhase === 'loop' 
              ? (direction === 'down' ? 'loop-up' : 'loop-down')
              : (direction === 'down' ? 'slide-out-up' : 'slide-out-down')
          }`}
        >
          {exitContent}
        </div>
      )}
      
      {/* Animation d'entrée du nouveau contenu */}
      {enterContent && (
        <div
          className={`elevator-content enter-content ${
            animationPhase === 'loop' 
              ? (direction === 'down' ? 'loop-up' : 'loop-down')
              : (direction === 'down' ? 'slide-in-up' : 'slide-in-down')
          }`}
          style={{
            animationDelay: animationPhase === 'slide' ? `${contentEntranceDelay}ms` : '0ms'
          }}
        >
          {enterContent}
        </div>
      )}
    </div>
  );
};

export default ElevatorTransition;
