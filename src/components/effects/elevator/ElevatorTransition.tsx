
import React, { useRef, useEffect, useState } from 'react';
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
  
  // Références pour accéder aux éléments DOM
  const contentRef = useRef<HTMLDivElement>(null);
  const exitContentRef = useRef<HTMLDivElement>(null);
  const enterContentRef = useRef<HTMLDivElement>(null);
  
  // Effet pour gérer l'animation simple de fondu
  useEffect(() => {
    if (!isTransitioning || !exitContentRef.current || !enterContentRef.current || !contentRef.current) return;
    
    const exitEl = exitContentRef.current;
    const enterEl = enterContentRef.current;
    const contentEl = contentRef.current;
    
    // Masquer le contenu d'origine
    contentEl.style.visibility = 'hidden';
    
    // Montrer les conteneurs de transition
    exitEl.style.visibility = 'visible';
    exitEl.style.opacity = '1';
    
    enterEl.style.visibility = 'visible';
    enterEl.style.opacity = '0';
    
    // Animation de fondu - 2000ms au total
    console.log("Démarrage de l'animation de fondu (2000ms)");
    
    // Phase 1: Fondu de sortie (1000ms)
    const fadeOutAnimation = exitEl.animate([
      { opacity: 1 },
      { opacity: 0 }
    ], {
      duration: 1000,
      easing: 'ease-in-out',
      fill: 'forwards'
    });
    
    // Phase 2: Fondu d'entrée (1000ms)
    setTimeout(() => {
      const fadeInAnimation = enterEl.animate([
        { opacity: 0 },
        { opacity: 1 }
      ], {
        duration: 1000,
        easing: 'ease-in-out',
        fill: 'forwards'
      });
      
      fadeInAnimation.onfinish = () => {
        console.log("Animation de fondu terminée, finalisation");
        
        // Restaurer la visibilité du contenu d'origine
        contentEl.style.visibility = 'visible';
        
        // Masquer les conteneurs de transition
        exitEl.style.visibility = 'hidden';
        enterEl.style.visibility = 'hidden';
        
        // Terminer la transition
        onAnimationComplete();
      };
    }, 1000);
    
    // Fonction de nettoyage
    return () => {
      exitEl.style.visibility = 'hidden';
      enterEl.style.visibility = 'hidden';
      contentEl.style.visibility = 'visible';
    };
  }, [isTransitioning, direction, exitContent, enterContent, onAnimationComplete]);
  
  // Si transition inactive, afficher simplement le contenu
  if (!isTransitioning) {
    return <div ref={contentRef} className="elevator-content">{children}</div>;
  }
  
  return (
    <div className="elevator-container">
      <div ref={contentRef} className="elevator-content">
        {children}
      </div>
      
      <div ref={exitContentRef} className="elevator-content exit-content" style={{ visibility: 'hidden' }}>
        <div id="exit-content-wrapper">
          {exitContent}
        </div>
      </div>
      
      <div ref={enterContentRef} className="elevator-content enter-content" style={{ visibility: 'hidden', opacity: 0 }}>
        <div id="enter-content-wrapper">
          {enterContent}
        </div>
      </div>
    </div>
  );
};

export default ElevatorTransition;
