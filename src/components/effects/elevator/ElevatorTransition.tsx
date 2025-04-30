
import React, { useRef, useEffect, useState, useMemo } from 'react';
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

  const barrierRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);
  const animationRef = useRef<Animation|null>(null);

  // Utilisation de useMemo pour les calculs coûteux des phases d'animation
  const animationConfig = useMemo(() => {
    // --- Préparer les 8 phases ---
    const weights = [8, 4, 2, 1, 1, 2, 4, 8];
    const total = weights.reduce((sum, w) => sum + w, 0);
    
    // Durées en ms, offsets et blur
    const durations = weights.map(w => (w * 7000) / total);
    const offsets = [0];
    durations.slice(0, -1).reduce((sum, d) => {
      sum += d;
      offsets.push(sum / 7000);
      return sum;
    }, 0);
    offsets.push(1);
    const blurMap = [0, 2, 6, 10, 10, 6, 2, 0];

    return { weights, durations, offsets, blurMap };
  }, []);

  useEffect(() => {
    if (!isTransitioning || animating === true) return;
    
    const barrier = barrierRef.current;
    const track = trackRef.current;
    if (!barrier || !track) return;

    setAnimating(true);
    
    // Annule toute animation précédente
    if (animationRef.current) {
      animationRef.current.cancel();
      animationRef.current = null;
    }

    // Créer les contenus une seule fois plutôt qu'à chaque frame
    const createDOMContent = (content: React.ReactNode): DocumentFragment => {
      const template = document.createElement('template');
      template.innerHTML = (content as React.ReactNode as any).toString();
      return template.content;
    };
    
    const exitFragment = createDOMContent(exitContent);
    const enterFragment = createDOMContent(enterContent);

    // Supprimer tout contenu précédent avant d'ajouter de nouveaux slides
    track.textContent = '';

    // Utiliser requestAnimationFrame pour prévenir les forced reflows
    requestAnimationFrame(() => {
      // Créer un fragment pour batching DOM updates
      const fragment = document.createDocumentFragment();
      
      // Créer les slides pour le contenu de sortie
      for (let i = 0; i < 7; i++) {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.style.cssText = `
          position: absolute;
          top: ${i * 100}%;
          width: 100%;
          height: 100%;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        `;
        
        // Clone du contenu de sortie
        slide.appendChild(exitFragment.cloneNode(true));
        fragment.appendChild(slide);
      }
      
      // Créer le dernier slide avec le contenu d'entrée
      const lastSlide = document.createElement('div');
      lastSlide.className = 'slide';
      lastSlide.style.cssText = `
        position: absolute;
        top: 700%;
        width: 100%;
        height: 100%;
        will-change: transform;
        transform: translateZ(0);
        backface-visibility: hidden;
      `;
      lastSlide.appendChild(enterFragment.cloneNode(true));
      fragment.appendChild(lastSlide);
      
      // Ajouter tous les slides en une seule opération DOM
      track.appendChild(fragment);
      
      // Appliquer les styles au track - utiliser CSS transform
      track.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 800%;
        will-change: transform, filter;
        transform: translateZ(0);
        backface-visibility: hidden;
      `;
      
      // Rendre la barrière visible
      barrier.style.visibility = 'visible';
      
      // Créer keyframes pour l'animation avec Web Animations API
      const { offsets, blurMap } = animationConfig;
      const keyframes = offsets.map((ofs, i) => ({
        offset: ofs,
        transform: `translateY(-${i * 100}%)`,
        filter: `blur(${blurMap[i]}px)`
      }));
      
      // Utiliser WAAPI pour l'animation
      animationRef.current = track.animate(keyframes, {
        duration: 7000,
        easing: 'linear',
        fill: 'forwards'
      });
      
      // Gérer la fin de l'animation
      animationRef.current.onfinish = () => {
        // Swap du contenu
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          // Mise à jour du DOM en une seule opération
          const tempContainer = document.createElement('div');
          tempContainer.appendChild(enterFragment.cloneNode(true));
          mainContent.innerHTML = tempContainer.innerHTML;
        }
        
        // Nettoyage
        barrier.style.visibility = 'hidden';
        track.textContent = '';
        track.style.height = '';
        animationRef.current = null;
        setAnimating(false);
        onAnimationComplete();
      };
    });
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
      }
      if (barrier) barrier.style.visibility = 'hidden';
      setAnimating(false);
    };
  }, [isTransitioning, exitContent, enterContent, onAnimationComplete, animating, animationConfig]);

  if (!isTransitioning) {
    return (
      <div id="main-content" className="elevator-content">
        {children}
      </div>
    );
  }

  return (
    <div className="elevator-container">
      {/* Contenu principal, caché pendant l'animation */}
      <div id="main-content" style={{ visibility: animating ? 'hidden' : 'visible' }}>
        {exitContent}
      </div>

      {/* Barrière + track pour l'animation */}
      <div 
        ref={barrierRef} 
        className="slider-barrier" 
        style={{ 
          visibility: 'hidden', 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          overflow: 'hidden',
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        <div ref={trackRef} id="slider-track"></div>
      </div>
    </div>
  );
};

export default ElevatorTransition;
