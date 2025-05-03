
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
        
        // Coefficient négatif pour que tous les éléments se déplacent dans le MÊME sens
        // La vitesse est proportionnelle à la profondeur (plus profond = plus lent)
        const translateY = -scrollY * depth * 0.2; // Négatif pour que les éléments montent quand on scrolle vers le bas
        
        // Effets de souris plus subtils pour plus de réalisme
        const translateX = mouseX * (depth * 15);
        const rotateX = -mouseY * (depth * 3);
        const rotateY = mouseX * (depth * 3);
        
        // Calcul de la profondeur Z basé sur la valeur de depth
        // Plus la valeur est élevée, plus l'élément est loin
        const translateZ = depth * -1000;
        
        element.style.transform = `
          translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      });
      
      // Traitement spécial pour l'arrière-plan avec un effet de parallaxe encore plus subtil
      const bgElements = document.querySelectorAll<HTMLElement>('[data-depth="0.05"]');
      bgElements.forEach((el) => {
        if (!el.classList.contains('parallax-element')) {
          // Déplacement très léger pour le fond (5% de la vitesse de défilement)
          // Mais dans la même direction que le contenu (vers le haut quand on scrolle vers le bas)
          const translateY = -scrollY * 0.05; 
          el.style.transform = `translateY(${translateY}px) scale(1.1)`;
        }
      });
      
      ticking = false;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
      if (!ticking) {
        rafId = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX = (clientX / window.innerWidth - 0.5) * 2;
      mouseY = (clientY / window.innerHeight - 0.5) * 2;
      
      if (!ticking) {
        rafId = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Initialisation immédiate pour éviter les sauts
    updateParallax();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);
};
