
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
      container.querySelectorAll('.parallax-element').forEach((element) => {
        const el = element as HTMLElement;
        const depth = parseFloat(el.dataset.depth || '0');
        const x = parseFloat(el.dataset.x || '0');
        const y = parseFloat(el.dataset.y || '0');
        
        // Le fond se déplace plus lentement avec un petit depth
        const translateY = depth * scrollY;
        
        // Augmenter l'effet de mouvement pour la souris
        const translateX = mouseX * (depth * 100);
        const rotateX = mouseY * (depth * 20);
        const rotateY = mouseX * (depth * 20);
        
        // Meilleure gestion de la profondeur Z pour un vrai effet 3D
        const translateZ = depth * -5000;
        
        let transform = '';
        
        if (el.classList.contains('fixed')) {
          // Style spécial pour l'arrière-plan
          transform = `
            translate3d(${translateX * 0.2}px, ${translateY * 0.1}px, -8000px)
            scale(1.5)
          `;
        } else {
          // Autres éléments avec effet 3D
          transform = `
            translate3d(${x + translateX}%, ${y + translateY}px, ${translateZ}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
          `;
        }
        
        el.style.transform = transform;
      });
      
      ticking = false;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Force initial render
    updateParallax();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef]);
};
