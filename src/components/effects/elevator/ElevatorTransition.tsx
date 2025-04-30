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

  const barrierRef   = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);
  const animationRef = useRef<Animation|null>(null);

  useEffect(() => {
    if (!isTransitioning || animating === true) return;
    const barrier = barrierRef.current!;
    const track   = trackRef.current!;

    setAnimating(true);
    // Annule toute animation précédente
    animationRef.current?.cancel();

    // --- Préparer les 8 phases ---
    const weights  = [8,4,2,1,1,2,4,8];
    const total    = weights.reduce((sum,w) => sum + w, 0);
    // Durées en ms, offsets et blur
    const durations = weights.map(w => (w * 7000) / total);
    const offsets   = [0];
    durations.slice(0,-1).reduce((sum,d) => {
      sum += d;
      offsets.push(sum / 7000);
      return sum;
    }, 0);
    offsets.push(1);
    const blurMap = [0,2,6,10,10,6,2,0];

    // --- Clonage du contenu existant ---
    // zone de sortie
    const exitWrapper = document.createElement('div');
    exitWrapper.innerHTML = (exitContent as React.ReactNode as any).toString();
    // zone d'entrée
    const enterWrapper = document.createElement('div');
    enterWrapper.innerHTML = (enterContent as React.ReactNode as any).toString();

    // --- Construire les 8 slides ---
    track.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const slide = exitWrapper.cloneNode(true) as HTMLElement;
      slide.classList.add('slide');
      slide.style.position = 'absolute';
      slide.style.top      = `${i * 100}%`;
      slide.style.width    = '100%';
      slide.style.height   = '100%';
      track.appendChild(slide);
    }
    // 8ᵉ slide = contenu entrant
    const lastSlide = enterWrapper.cloneNode(true) as HTMLElement;
    lastSlide.classList.add('slide');
    lastSlide.style.position = 'absolute';
    lastSlide.style.top      = `700%`;
    lastSlide.style.width    = '100%';
    lastSlide.style.height   = '100%';
    track.appendChild(lastSlide);

    // Ajuste la taille du track
    track.style.position = 'absolute';
    track.style.top      = '0';
    track.style.left     = '0';
    track.style.width    = '100%';
    track.style.height   = '800%';

    // Affiche la barrière, masque le contenu normal
    barrier.style.visibility = 'visible';

    // --- Créer les keyframes et lancer l'animation ---
    const keyframes = offsets.map((ofs,i) => ({
      offset:    ofs,
      transform: `translateY(-${i*100}%)`,
      filter:    `blur(${blurMap[i]}px)`
    }));

    animationRef.current = track.animate(keyframes, {
      duration: 7000,
      easing:   'linear',
      fill:     'forwards'
    });

    // À la fin
    animationRef.current.onfinish = () => {
      // swap du contenu
      const mainContent = document.getElementById('main-content')!;
      mainContent.innerHTML = enterWrapper.innerHTML;
      // reset
      barrier.style.visibility = 'hidden';
      track.innerHTML = '';
      track.style.height = '';
      animationRef.current = null;
      setAnimating(false);
      onAnimationComplete();
    };

    // Cleanup si le composant se démonte
    return () => {
      animationRef.current?.cancel();
      barrier.style.visibility = 'hidden';
      setAnimating(false);
    };
  }, [isTransitioning, exitContent, enterContent, onAnimationComplete, animating]);

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

      {/* Barrière + track pour le Repetile */}
      <div 
        ref={barrierRef} 
        className="slider-barrier" 
        style={{ visibility: 'hidden', position: 'absolute', top:0, left:0, width:'100%', height:'100%', overflow:'hidden' }}
      >
        <div ref={trackRef} id="slider-track"></div>
      </div>
    </div>
  );
};

export default ElevatorTransition;
