
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
        
        // Vitesse de défilement différente basée sur la profondeur
        // Plus depth est petit, plus l'élément défile lentement
        const translateY = depth * scrollY;
        
        // Effet de mouvement de la souris plus prononcé basé sur la profondeur
        const translateX = mouseX * (depth * 50);
        const rotateX = mouseY * (depth * 10);
        const rotateY = mouseX * (depth * 10);
        
        // Gestion de la profondeur Z
        // Background: très loin en Z négatif (déjà défini dans le composant Background)
        // Peinture: entre -5000 et -500 selon leur profondeur
        // Contenu: au premier plan (z-index positif)
        let translateZ = 0;
        
        if (el.classList.contains('fixed')) {
          // C'est le fond, on garde son translateZ défini dans le composant
          translateZ = -10000;
        } else {
          // Pour les autres éléments, on calcule en fonction de la profondeur
          translateZ = -5000 + (depth * 5000); // De -5000 à 0 selon depth
        }

        el.style.transform = `
          translate3d(${x + translateX}%, ${y + translateY}px, ${translateZ}px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Exécuter une première fois pour initialiser la position des éléments
    updateParallax();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef]);
};
