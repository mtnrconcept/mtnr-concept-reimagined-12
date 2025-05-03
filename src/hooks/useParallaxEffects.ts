
import { useEffect } from 'react';

interface ParallaxHookProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useParallaxEffects = ({ containerRef }: ParallaxHookProps) => {
  useEffect(() => {
    if (!containerRef.current) return;
    
    let scrollY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;
    let rafId: number;

    const updateElements = () => {
      const elements = containerRef.current?.querySelectorAll<HTMLElement>('.parallax-element');
      elements?.forEach(el => {
        const depth = parseFloat(el.dataset.depth || '0');
        
        // Direction du déplacement cohérente pour tous les éléments (vers le HAUT quand on scroll vers le BAS)
        // Plus la profondeur est grande, plus l'élément bouge lentement
        const translateY = -scrollY * depth * 0.15; // Négatif pour inverser le déplacement
        const translateX = mouseX * (depth * 15);
        const translateZ = depth * -1000;
        
        el.style.transform = `
          translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
          scale(${1 + Math.abs(depth) * 0.1})
        `;
      });

      ticking = false;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
      requestAnimationFrame(() => {
        if (!ticking) {
          rafId = requestAnimationFrame(updateElements);
          ticking = true;
        }
      });
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      
      if (!ticking) {
        rafId = requestAnimationFrame(updateElements);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Initialisation pour éviter les sauts au premier affichage
    updateElements();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);
};
