
import { useEffect } from 'react';

export const useParallaxEffect = (containerRef: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let scrollY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleScroll = () => {
      scrollY = window.scrollY;
      updateParallax();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX = (clientX / window.innerWidth - 0.5) * 2;
      mouseY = (clientY / window.innerHeight - 0.5) * 2;
      updateParallax();
    };

    const updateParallax = () => {
      container.querySelectorAll('.parallax-element').forEach((element) => {
        const el = element as HTMLElement;
        const depth = parseFloat(el.dataset.depth || '0');
        const x = parseFloat(el.dataset.x || '0');
        const y = parseFloat(el.dataset.y || '0');
        
        // Réduire l'effet de défilement pour le fond avec une profondeur faible
        const translateY = depth < 0.01 
          ? scrollY * depth * 0.05 // Très lent pour le background
          : scrollY * depth; // Normal pour les autres éléments
        
        const translateX = mouseX * (depth * 20);
        const rotateX = mouseY * (depth * 5);
        const rotateY = mouseX * (depth * 5);
        
        // Ajustement de la profondeur Z basée sur la valeur de depth
        // Plus depth est petit, plus l'élément est éloigné
        const translateZ = depth < 0.01 
          ? -10000 // Background très éloigné
          : depth * -1000; // Les autres éléments plus proches

        el.style.transform = `
          translate3d(${x + translateX}%, ${y + translateY}px, ${translateZ}px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    updateParallax();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef]);
};
