
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
      // Force update on resize
      requestAnimationUpdate();
    };

    const requestAnimationUpdate = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    const updateParallax = () => {
      const elements = container.querySelectorAll<HTMLElement>('.parallax-element');
      
      // Traitement des éléments avec effet 3D prononcé
      elements.forEach((element) => {
        const depth = parseFloat(element.dataset.depth || '0');
        const x = parseFloat(element.dataset.x || '0');
        const y = parseFloat(element.dataset.y || '0');
        
        const translateY = depth * scrollY * 0.5; // Réduction de l'effet de scroll
        const translateX = mouseX * (depth * 50);  // Réduction de l'effet de souris
        const rotateX = -mouseY * (depth * 5);    // Réduction de la rotation
        const rotateY = mouseX * (depth * 5);
        const translateZ = depth * -800;
        
        element.style.transform = `
          translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      });
      
      // Traitement spécial pour l'arrière-plan
      const bgElements = document.querySelectorAll<HTMLElement>('[data-depth="0.05"]');
      bgElements.forEach((el) => {
        if (!el.classList.contains('parallax-element')) {
          const translateY = scrollY * 0.03; // Mouvement plus lent
          el.style.transform = `translateY(${translateY}px) scale(1.05)`;
        }
      });
      
      ticking = false;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Force initial render
    requestAnimationUpdate();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);
};
