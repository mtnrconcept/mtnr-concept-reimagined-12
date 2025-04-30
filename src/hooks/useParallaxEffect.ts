
import { useEffect, useCallback } from 'react';

export const useParallaxEffect = (containerRef: React.RefObject<HTMLDivElement>) => {
  // Fonction de mise à jour optimisée, séparée pour debouncing/throttling
  const updateParallax = useCallback((scrollY: number, mouseX = 0, mouseY = 0) => {
    const container = containerRef.current;
    if (!container) return;

    // Obtenir tous les éléments à animer une seule fois (hors de la boucle)
    const elements = container.querySelectorAll<HTMLElement>('.parallax-element');
    
    // Utiliser requestAnimationFrame pour synchroniser les mises à jour avec le rafraîchissement du navigateur
    requestAnimationFrame(() => {
      elements.forEach((element) => {
        const depth = parseFloat(element.dataset.depth || '0');
        
        // Calcul des transformations basées sur la position de défilement et de la souris
        // Utilisation de transformations plus efficaces (translate3d)
        const translateY = depth * scrollY * 0.1;
        const translateX = mouseX * (depth * 30);
        const rotateX = -mouseY * (depth * 3);
        const rotateY = mouseX * (depth * 3);
        const translateZ = depth * -500;
        
        // Appliquer toutes les transformations en une seule opération
        element.style.transform = `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      
      // Traitement spécial pour les éléments de fond
      const bgElements = container.querySelectorAll<HTMLElement>('[data-depth="0.05"]:not(.parallax-element)');
      bgElements.forEach((el) => {
        const translateY = scrollY * 0.15;
        el.style.transform = `translate3d(0, ${translateY}px, 0) scale(1.1)`;
      });
    });
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let scrollY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;
    let rafId: number;
    
    // Throttling pour scroll events
    const handleScroll = () => {
      scrollY = window.scrollY;
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          updateParallax(scrollY, mouseX, mouseY);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Throttling pour mouse move events
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX = (clientX / window.innerWidth - 0.5) * 2;
      mouseY = (clientY / window.innerHeight - 0.5) * 2;
      
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          updateParallax(scrollY, mouseX, mouseY);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Debouncing pour les events de redimensionnement
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateParallax(scrollY, mouseX, mouseY);
      }, 100); // Attendre 100ms après la fin du resize
    };

    // Appliquer immédiatement une première fois
    updateParallax(window.scrollY);

    // Ajout des écouteurs d'événements
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimeout);
    };
  }, [containerRef, updateParallax]);
};
