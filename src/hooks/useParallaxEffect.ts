
import { useEffect } from 'react';

export const useParallaxEffect = (containerRef: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let scrollY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;

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

    const requestAnimationUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    const updateParallax = () => {
      const elements = container.querySelectorAll('.parallax-element');
      const bgElements = document.querySelectorAll('.parallax-element[data-depth="0.05"]');
      
      // Traitement spécial pour l'arrière-plan
      bgElements.forEach((element) => {
        const el = element as HTMLElement;
        const translateX = mouseX * 20; // Mouvement très léger pour l'arrière-plan
        const translateY = scrollY * 0.05; // Défilement très lent
        
        el.style.transform = `translate3d(${translateX}px, ${translateY}px, -8000px) scale(1.5)`;
      });
      
      // Autres éléments avec effet 3D prononcé
      elements.forEach((element) => {
        if (element.getAttribute('data-depth') === '0.05') return; // Skip background elements
        
        const el = element as HTMLElement;
        const depth = parseFloat(el.dataset.depth || '0');
        const x = parseFloat(el.dataset.x || '0');
        const y = parseFloat(el.dataset.y || '0');
        
        const translateY = depth * scrollY;
        const translateX = mouseX * (depth * 100);
        const rotateX = mouseY * (depth * 20);
        const rotateY = mouseX * (depth * 20);
        const translateZ = depth * -2000;
        
        el.style.transform = `
          translate3d(${x + translateX}%, ${y + translateY}px, ${translateZ}px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      });
      
      ticking = false;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Force initial render
    requestAnimationUpdate();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef]);
};
