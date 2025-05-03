
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

    const updateParallax = () => {
      // Traitement des éléments avec effet 3D prononcé
      const elements = container.querySelectorAll<HTMLElement>('.parallax-element');
      elements.forEach((element) => {
        const depth = parseFloat(element.dataset.depth || '0');
        
        // Déplacement dans la MÊME direction que le scroll (coefficient positif)
        // mais à une vitesse réduite pour donner l'impression de profondeur
        const translateY = depth * scrollY * 0.15;
        const translateX = mouseX * (depth * 20);
        const rotateX = -mouseY * (depth * 5);
        const rotateY = mouseX * (depth * 5);
        const translateZ = depth * -400; // Réduction de la profondeur Z pour effet plus subtil
        
        element.style.transform = `
          translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      });
      
      // Traitement spécial pour l'arrière-plan avec effet de parallax encore plus subtil
      const bgElements = document.querySelectorAll<HTMLElement>('[data-depth="0.05"]');
      bgElements.forEach((el) => {
        if (!el.classList.contains('parallax-element')) {
          const translateY = scrollY * 0.10; // Coefficient positif et réduit (10%)
          el.style.transform = `translateY(${translateY}px) scale(1.1)`;
        }
      });
      
      ticking = false;
    };

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
        rafId = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Initialisation immédiate pour éviter les sauts
    requestAnimationUpdate();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);
};
