
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
    contentEntranceDelay 
  } = useElevatorTransition({
    isActive,
    onAnimationComplete,
    videoRef,
    currentPath: children  // Nous passons children, qui est un ReactNode
  });

  return (
    <div className="elevator-container" ref={containerRef}>
      {isActive && (
        <>
          {/* Video Background */}
          <div className="elevator-video-container">
            <video 
              ref={videoRef} 
              className={`elevator-video ${direction === 'up' ? 'video-reversed' : ''} blur-motion`}
              src="/lovable-uploads/ascensceur.mp4"
              muted
              playsInline
            />
          </div>
          
          {/* Animation de sortie du contenu actuel */}
          {exitContent && (
            <div
              className={`elevator-content exit-content ${
                direction === 'down' ? 'slide-out-up' : 
                direction === 'up' ? 'slide-out-down' : ''
              }`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            >
              {exitContent}
            </div>
          )}
          
          {/* Animation d'entrée du nouveau contenu */}
          {enterContent && (
            <div
              className={`elevator-content enter-content ${
                direction === 'down' ? 'slide-in-up' : 
                direction === 'up' ? 'slide-in-down' : ''
              }`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%", 
                height: "100%",
                animationDelay: `${contentEntranceDelay / 1000}s`
              }}
            >
              {enterContent}
            </div>
          )}
        </>
      )}
      
      {/* Contenu normal lorsque la transition n'est pas active */}
      {!isActive && children}
    </div>
  );
};

export default ElevatorTransition;
