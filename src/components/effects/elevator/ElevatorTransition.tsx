
import React, { useRef, useEffect } from 'react';
import { ElevatorTransitionProps } from './ElevatorTypes';
import { useElevatorTransition } from './useElevatorTransition';

const ElevatorTransition = ({ children, isActive, onAnimationComplete }: ElevatorTransitionProps) => {
  const { 
    direction, 
    exitContent, 
    enterContent,
    isTransitioning,
    contentEntranceDelay
  } = useElevatorTransition({
    isActive,
    onAnimationComplete,
    currentPath: children
  });
  
  const barrierRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const newContentRef = useRef<HTMLDivElement>(null);
  
  // Effet pour gérer l'animation "repetile" avancée
  useEffect(() => {
    if (!isTransitioning || !barrierRef.current || !trackRef.current || !newContentRef.current) return;
    
    const barrier = barrierRef.current;
    const track = trackRef.current;
    
    // Créer l'animation "repetile" avec Web Animations API
    const createLoopAnimation = () => {
      return track.animate([
        { offset: 0,   transform: 'translateY(0)',    filter: 'blur(0)',  easing: 'ease-in' },
        { offset: 0.1, transform: 'translateY(-10%)', filter: 'blur(4px)' },
        { offset: 0.9, transform: 'translateY(-90%)', filter: 'blur(4px)' },
        { offset: 1,   transform: 'translateY(-100%)', filter: 'blur(0)',  easing: 'ease-out' }
      ], {
        duration: 6000,   // 6s = 4 cycles × 1.5s
        iterations: 1,
        fill: 'forwards'
      });
    };
    
    // Lancer l'animation de loop
    const loopAnim = createLoopAnimation();
    
    // À la fin de l'animation de loop, déclencher la transition finale
    loopAnim.onfinish = () => {
      console.log("Fin des répétitions repetile après 6s, passage à la transition finale");
      const newContentEl = newContentRef.current;
      
      if (!newContentEl) return;
      
      // Appliquer les classes pour la transition finale
      barrier.classList.add(direction === 'down' ? 'barrier-slide-out-up' : 'barrier-slide-out-down');
      newContentEl.classList.add('enter-content-visible');
      newContentEl.classList.add(direction === 'down' ? 'new-slide-in-down' : 'new-slide-in-up');
      
      // Événement de fin d'animation
      const handleAnimationEnd = () => {
        onAnimationComplete();
        newContentEl.removeEventListener('animationend', handleAnimationEnd);
      };
      
      newContentEl.addEventListener('animationend', handleAnimationEnd, { once: true });
    };
    
    // Cleanup function
    return () => {
      if (loopAnim) loopAnim.cancel();
    };
  }, [isTransitioning, direction, onAnimationComplete]);
  
  // Si transition non active, simplement afficher le contenu
  if (!isTransitioning) {
    return <>{children}</>;
  }

  return (
    <div className="elevator-container">
      {/* Barrière qui masque le défilement */}
      <div ref={barrierRef} className="slider-barrier">
        <div ref={trackRef} className="slider-track">
          {/* Premier slide - contenu actuel */}
          <div className="slide">
            {exitContent}
          </div>
          {/* Deuxième slide - copie identique pour le loop */}
          <div className="slide">
            {exitContent}
          </div>
        </div>
      </div>
      
      {/* Contenu qui entrera avec animation slide-in */}
      <div 
        ref={newContentRef} 
        className="elevator-content enter-content"
        style={{ animationDelay: `${contentEntranceDelay}ms` }}
      >
        {enterContent}
      </div>
    </div>
  );
};

export default ElevatorTransition;
