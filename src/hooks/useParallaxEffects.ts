
import { useEffect } from 'react';

interface ParallaxHookProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const useParallaxEffects = ({ containerRef }: ParallaxHookProps) => {
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      updateParallax(scrollY);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      updateParallax(window.scrollY, mouseX, mouseY);
    };
    
    const updateParallax = (scrollY: number, mouseX = 0, mouseY = 0) => {
      const elements = containerRef.current?.querySelectorAll<HTMLElement>('.parallax-element');
      elements?.forEach(el => {
        const depth = parseFloat(el.dataset.depth || '0');
        const x = parseFloat(el.dataset.x || '0');
        const y = parseFloat(el.dataset.y || '0');
        
        // Pour les éléments ayant une position Y importante, on s'assure qu'ils restent visibles pendant le défilement
        // Si la coordonnée y est élevée, on la réduit en fonction du défilement pour qu'elle apparaisse en scrollant
        const yAdjusted = y > 100 ? y - scrollY * 0.05 : y;
        
        // Calcul de la translation en fonction de la profondeur et du défilement
        const translateY = scrollY * depth * 0.2; // Influence modérée du défilement
        const translateX = mouseX * (depth * 20);
        const scale = el.classList.contains('fixed') ? 1.1 : 1;
        
        el.style.transform = `
          translate3d(${translateX}px, ${translateY}px, 0)
          scale(${scale})
        `;
        
        // Ajuste l'opacité en fonction de la position de défilement
        if (y > 100) {
          const opacityBase = parseFloat(el.style.opacity || '1');
          const scrollFactor = Math.min(1, Math.max(0, scrollY / 1000)); // Normalise entre 0 et 1
          el.style.opacity = `${opacityBase * (0.2 + scrollFactor * 0.8)}`; // Fait apparaître progressivement
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
