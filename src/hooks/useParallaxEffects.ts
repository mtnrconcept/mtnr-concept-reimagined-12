
import { useEffect, useCallback, useRef } from 'react';

interface ParallaxHookProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useParallaxEffects = ({ containerRef }: ParallaxHookProps) => {
  // Utiliser refs pour stocker les positions et états
  const lastScrollY = useRef<number>(window.scrollY);
  const lastMouseX = useRef<number>(0);
  const lastMouseY = useRef<number>(0);
  const ticking = useRef<boolean>(false);
  const animationId = useRef<number | null>(null);
  const resizeTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fonction d'animation optimisée extraite pour être memoizée
  const updateParallax = useCallback((
    scrollY: number,
    mouseX: number = 0,
    mouseY: number = 0
  ) => {
    const container = containerRef.current;
    if (!container) return;

    // Récupère tous les éléments en une fois
    const elements = container.querySelectorAll<HTMLElement>('.parallax-element');
    
    // Utiliser requestAnimationFrame pour synchroniser avec les rafraîchissements d'écran
    animationId.current = requestAnimationFrame(() => {
      elements.forEach(el => {
        // Extraction des attributs data une seule fois
        const depth = parseFloat(el.dataset.depth || '0');
        const x = parseFloat(el.dataset.x || '0');
        const y = parseFloat(el.dataset.y || '0');
        
        // Calculs optimisés de visibilité et positions
        const viewportHeight = window.innerHeight;
        const scrollPercent = Math.min(1, scrollY / (document.body.scrollHeight - viewportHeight));
        
        // Calcul en une seule opération
        let visibility = 1;
        let adjustedY = y;
        
        if (y > 100) {
          const appearThreshold = y * 5;
          visibility = Math.min(1, Math.max(0, scrollY / appearThreshold));
          const scrollFactor = 0.5 + Math.abs(depth) * 0.5;
          adjustedY = y - scrollY * scrollFactor * 0.1;
        }
        
        // Calcul des transformations en une seule passe
        const translateY = depth * scrollY * 0.2;
        const translateX = mouseX * (depth * 20);
        const translateZ = depth * -500;
        const rotateX = -mouseY * (depth * 2);
        const rotateY = mouseX * (depth * 2);
        
        // Précalcul de l'opacité baseOpacity * visibility
        const baseOpacity = el.classList.contains('opacity-20') ? 0.2 :
                          el.classList.contains('opacity-30') ? 0.3 :
                          el.classList.contains('opacity-35') ? 0.35 :
                          el.classList.contains('opacity-40') ? 0.4 :
                          el.classList.contains('opacity-50') ? 0.5 :
                          el.classList.contains('opacity-70') ? 0.7 : 1;
        
        // Appliquer toutes les transformations CSS en une seule opération
        const newStyles = {
          transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          opacity: `${baseOpacity * visibility}`
        };
        
        // Appliquer conditionnellement la propriété top
        if (y > 100) {
          newStyles['top'] = `${adjustedY}%`;
        }
        
        // Appliquer les styles en une opération
        Object.assign(el.style, newStyles);
      });
    });
  }, [containerRef]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Fonction throttle pour les événements de défilement
    const handleScroll = () => {
      lastScrollY.current = window.scrollY;
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          updateParallax(lastScrollY.current, lastMouseX.current, lastMouseY.current);
          ticking.current = false;
        });
      }
    };
    
    // Fonction throttle pour les mouvements de souris
    const handleMouseMove = (e: MouseEvent) => {
      lastMouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      lastMouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
      
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          updateParallax(lastScrollY.current, lastMouseX.current, lastMouseY.current);
          ticking.current = false;
        });
      }
    };
    
    // Fonction debounce pour le redimensionnement
    const handleResize = () => {
      if (resizeTimeoutId.current) {
        clearTimeout(resizeTimeoutId.current);
      }
      
      resizeTimeoutId.current = setTimeout(() => {
        updateParallax(lastScrollY.current, lastMouseX.current, lastMouseY.current);
      }, 100); // 100ms de debounce
    };
    
    // Initialisation au chargement
    updateParallax(window.scrollY);
    
    // Ajout des écouteurs d'événements avec passive pour de meilleures performances
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      // Nettoyage complet
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      
      if (resizeTimeoutId.current) {
        clearTimeout(resizeTimeoutId.current);
      }
    };
  }, [containerRef, updateParallax]);
};
