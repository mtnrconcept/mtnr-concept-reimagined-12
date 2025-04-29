
import { useEffect } from 'react';

export const useParallaxEffect = (containerRef: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let scrollY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;
    let rafId: number;

    const handleScroll = () => {
      scrollY = window.scrollY;
      requestAnimationUpdate();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX = (clientX / window.innerWidth - 0.5) * 2;
      mouseY = (clientY / window.innerHeight - 0.5) * 2;
      requestAnimationUpdate();
    };

    const handleResize = () => {
      requestAnimationUpdate();
    };

    const requestAnimationUpdate = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    const updateParallax = () => {
      // Traitement des éléments avec effet 3D prononcé
      const elements = container.querySelectorAll<HTMLElement>('.parallax-element');
      elements.forEach((element) => {
        const depth = parseFloat(element.dataset.depth || '0');
        const x = parseFloat(element.dataset.x || '0');
        const y = parseFloat(element.dataset.y || '0');
        
        // Ajuste la translation Y pour suivre le défilement de page avec amplification par la profondeur
        const translateY = depth * scrollY * 0.1; // Réduit l'influence du défilement
        const translateX = mouseX * (depth * 30);
        const rotateX = -mouseY * (depth * 3);
        const rotateY = mouseX * (depth * 3);
        const translateZ = depth * -500;
        
        // Applique les transformations pour le parallax
        element.style.transform = `
          translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      });
      
      // Traitement spécial pour l'arrière-plan avec effet de parallax
      const bgElements = document.querySelectorAll<HTMLElement>('[data-depth="0.05"]');
      bgElements.forEach((el) => {
        if (!el.classList.contains('parallax-element')) {
          const translateY = scrollY * 0.15; // Vitesse réduite
          el.style.transform = `translateY(${translateY}px) scale(1.1)`;
        }
      });
      
      ticking = false;
    };

    // Applique immédiatement une première fois pour positionner correctement les éléments
    updateParallax();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    requestAnimationUpdate();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);
};
