
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
        // Inversion du signe pour que le mouvement aille dans le bon sens
        const translateY = -scrollY * depth;
        const translateX = mouseX * (depth * 10);
        const scale = el.classList.contains('fixed') ? 1.1 : 1;
        
        el.style.transform = `
          translate3d(${translateX}px, ${translateY}px, 0)
          scale(${scale})
        `;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef]);
};
