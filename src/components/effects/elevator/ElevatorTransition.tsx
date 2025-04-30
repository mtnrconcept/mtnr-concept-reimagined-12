
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
  const barrierRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Effet pour gérer l'animation "repetile" avancée avec 8 phases
  useEffect(() => {
    if (!isTransitioning || !barrierRef.current || !trackRef.current || !contentRef.current) return;
    
    const barrier = barrierRef.current;
    const track = trackRef.current;
    const contentEl = contentRef.current;
    
    // Configuration avancée avec 8 phases et poids spécifiques
    const weights = [8, 4, 2, 1, 1, 2, 4, 8]; // très lent → rapide → rapide → très lent
    const total = weights.reduce((a, b) => a + b, 0);
    
    // Durées en ms pour chaque phase (total = 7000ms)
    const durations = weights.map(w => w * 7000 / total);
    
    // Offsets normalisés [0, t1, t2, ..., t7, 1]
    const offsets = [0];
    let acc = 0;
    for (let i = 0; i < durations.length - 1; i++) {
      acc += durations[i];
      offsets.push(acc / 7000);
    }
    offsets.push(1);
    
    // Blur à chaque étape (plus c'est rapide, plus c'est flou)
    const blurMap = [0, 2, 6, 10, 10, 6, 2, 0]; // 8 valeurs pour les 8 phases
    
    // Préparation du contenu pour les slides
    const oldHTML = exitContent ? 
      React.isValidElement(exitContent) ? 
        document.createElement('div').appendChild(
          document.importNode(
            document.getElementById('exit-content-wrapper')!, true
          )
        ).innerHTML
        : 'Loading...'
      : 'Loading...';
        
    // Nettoyer le track
    track.innerHTML = '';
    
    // Créer les 7 slides de "vieux contenu"
    for (let i = 0; i < 7; i++) {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.innerHTML = oldHTML;
      slide.style.top = (i * 100) + '%';
      track.appendChild(slide);
    }
    
    // 8ème slide = "nouveau contenu"
    if (enterContent && document.getElementById('enter-content-wrapper')) {
      const lastSlide = document.createElement('div');
      lastSlide.className = 'slide';
      lastSlide.innerHTML = document.createElement('div').appendChild(
        document.importNode(
          document.getElementById('enter-content-wrapper')!, true
        )
      ).innerHTML;
      lastSlide.style.top = '700%';
      track.appendChild(lastSlide);
    }
    
    // Ajuster la hauteur du track à 800%
    track.style.height = '800%';
    
    // Afficher la barrière, masquer le contenu d'origine
    barrier.style.visibility = 'visible';
    contentEl.style.visibility = 'hidden';
    
    // Créer un seul animate() synchronisé sur 7000ms avec les 8 phases
    const keyframes = offsets.map((offset, i) => ({
      offset: offset,
      transform: `translateY(-${i * 100}%)`,
      filter: `blur(${blurMap[i]}px)`
    }));
    
    console.log("Démarrage de l'animation Repetile avancée sur 7000ms avec 8 phases");
    const animation = track.animate(keyframes, {
      duration: 7000,
      fill: 'forwards'
    });
    
    // À la fin de l'animation
    animation.onfinish = () => {
      console.log("Animation Repetile terminée, finalisation");
      
      // Swap du contenu
      contentEl.style.visibility = 'visible';
      barrier.style.visibility = 'hidden';
      track.innerHTML = '';
      track.style.height = '';
      
      // Terminer la transition
      onAnimationComplete();
    };
    
    // Cleanup function
    return () => {
      if (animation) animation.cancel();
      barrier.style.visibility = 'hidden';
      contentEl.style.visibility = 'visible';
    };
  }, [isTransitioning, direction, exitContent, enterContent, onAnimationComplete]);
  
  // Si transition inactive, afficher simplement le contenu
  if (!isTransitioning) {
    return <div ref={contentRef} className="elevator-content">{children}</div>;
  }
  
  return (
    <div className="elevator-container">
      <div ref={contentRef} className="elevator-content exit-content">
        <div id="exit-content-wrapper">
          {exitContent}
        </div>
      </div>
      
      {/* Barrière qui masque le défilement */}
      <div ref={barrierRef} className="slider-barrier">
        <div ref={trackRef} className="slider-track"></div>
      </div>
      
      {/* Contenu qui entrera à la fin */}
      <div className="elevator-content enter-content visually-hidden">
        <div id="enter-content-wrapper">
          {enterContent}
        </div>
      </div>
    </div>
  );
};

export default ElevatorTransition;
