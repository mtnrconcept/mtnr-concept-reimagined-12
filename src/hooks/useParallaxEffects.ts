
import { useEffect } from 'react';

interface ParallaxHookProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useParallaxEffects = ({ containerRef }: ParallaxHookProps) => {
  useEffect(() => {
    if (!containerRef.current) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const handleScroll = () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax(lastScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax(lastScrollY, mouseX, mouseY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    const updateParallax = (scrollY: number, mouseX = 0, mouseY = 0) => {
      const elements = containerRef.current?.querySelectorAll<HTMLElement>('.parallax-element');
      elements?.forEach(el => {
        const depth = parseFloat(el.dataset.depth || '0');
        const x = parseFloat(el.dataset.x || '0');
        const y = parseFloat(el.dataset.y || '0');
        
        // Ajuster la visibilité basée sur le défilement
        // Si l'élément est loin en bas de la page, il sera masqué jusqu'à ce qu'on défile assez
        const viewportHeight = window.innerHeight;
        const scrollPercent = Math.min(1, scrollY / (document.body.scrollHeight - viewportHeight));
        const elementScrollPosition = y * 10; // Multiplication pour espacer les éléments
        
        // Calcul de visibilité: l'élément devient visible lorsque le défilement atteint sa position
        let visibility = 1;
        
        // Éléments avec y élevé apparaissent progressivement au défilement
        if (y > 100) {
          const appearThreshold = y * 5; // Quand l'élément doit commencer à apparaître
          visibility = Math.min(1, Math.max(0, scrollY / appearThreshold));
        }
        
        // Adaptation des coordonnées y en fonction du défilement
        // Les éléments avec y élevé "montent" avec le défilement pour apparaître dans la vue
        let adjustedY = y;
        if (y > 100) {
          // Formule: y - facteur * défilement, où le facteur dépend de la profondeur
          const scrollFactor = 0.5 + Math.abs(depth) * 0.5; // Plus profond = moins d'effet
          adjustedY = y - scrollY * scrollFactor * 0.1;
        }
        
        // Calcul final de la transformation
        const translateY = depth * scrollY * 0.2; // Effet parallax vertical
        const translateX = mouseX * (depth * 20); // Effet souris horizontal
        const translateZ = depth * -500; // Profondeur Z
        const rotateX = -mouseY * (depth * 2); // Rotation X basée sur position souris
        const rotateY = mouseX * (depth * 2); // Rotation Y basée sur position souris
        
        el.style.transform = `
          translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
        
        // Ajuster l'opacité en fonction de la visibilité calculée
        const baseOpacity = el.classList.contains('opacity-20') ? 0.2 :
                           el.classList.contains('opacity-30') ? 0.3 :
                           el.classList.contains('opacity-35') ? 0.35 :
                           el.classList.contains('opacity-40') ? 0.4 :
                           el.classList.contains('opacity-50') ? 0.5 :
                           el.classList.contains('opacity-70') ? 0.7 : 1;
                           
        el.style.opacity = `${baseOpacity * visibility}`;
        
        // Ajuste la position Y pour que les éléments apparaissent en scrollant
        if (y > 100) {
          el.style.top = `${adjustedY}%`;
        }
      });
    };
    
    // Initialisation immédiate
    updateParallax(window.scrollY);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef]);
};
