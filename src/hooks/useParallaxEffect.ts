
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
        
        let translateY = depth * scrollY;
        
        // Plus de mouvement pour les éléments plus proches
        const translateX = mouseX * (depth * 100);
        const rotateX = mouseY * (depth * 15);
        const rotateY = mouseX * (depth * 15);
        
        // Gestion améliorée de la profondeur Z
        let translateZ = 0;
        
        if (el.classList.contains('fixed')) {
          // L'arrière-plan reste très loin
          translateZ = -15000;
        } else {
          // Les autres éléments sont répartis entre -5000 et -1000
          translateZ = -5000 + (depth * 4000);
        }

        el.style.transform = `
          translate3d(${x + translateX}%, ${y + translateY}px, ${translateZ}px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          ${el.classList.contains('fixed') ? 'scale(2)' : ''}
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
