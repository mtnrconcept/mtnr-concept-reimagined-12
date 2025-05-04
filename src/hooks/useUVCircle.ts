
import { useRef } from "react";
import { useIsMobile } from "./use-mobile";

export function useUVCircle() {
  const uvCircleRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  
  const createUVCircle = (mousePosition: { x: number; y: number }) => {
    if (!uvCircleRef.current) {
      const circle = document.createElement('div');
      circle.className = 'uv-light-circle active';
      circle.style.left = `${mousePosition.x}px`;
      circle.style.top = `${mousePosition.y}px`;
      // Désactiver les transitions sur mobile pour un suivi instantané
      if (isMobile) {
        circle.style.transition = 'none';
        circle.style.willChange = 'left, top'; // Optimisation pour le rendu
      }
      document.body.appendChild(circle);
      uvCircleRef.current = circle;
    }
  };

  const removeUVCircle = () => {
    if (uvCircleRef.current) {
      uvCircleRef.current.remove();
      uvCircleRef.current = null;
    }
  };

  return {
    uvCircleRef,
    createUVCircle,
    removeUVCircle
  };
}
