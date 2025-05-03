
import { useEffect, useRef, useState } from "react";
import { useTorch } from "@/components/effects/TorchContext";
import { use3DTorch } from "@/components/effects/Torch3DContext";

export const useIlluminatedElement = () => {
  const elementRef = useRef<HTMLElement>(null);
  const { isTorchActive, mousePosition } = useTorch();
  const { is3DModeActive } = use3DTorch();
  const [isIlluminated, setIsIlluminated] = useState(false);
  const lastCheckTime = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!elementRef.current || !isTorchActive) {
      if (isIlluminated) {
        setIsIlluminated(false);
        if (elementRef.current) {
          elementRef.current.style.filter = "";
          elementRef.current.style.transition = "";
        }
      }
      return;
    }
    
    const checkIllumination = () => {
      // Limiter la fréquence des vérifications pour améliorer les performances
      const now = performance.now();
      if (now - lastCheckTime.current < 50) { // Vérifier au maximum toutes les 50ms
        animationFrameId.current = requestAnimationFrame(checkIllumination);
        return;
      }
      lastCheckTime.current = now;
      
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      
      // Ignorer les éléments hors écran pour améliorer les performances
      if (rect.bottom < 0 || rect.top > window.innerHeight ||
          rect.right < 0 || rect.left > window.innerWidth) {
        if (isIlluminated) {
          setIsIlluminated(false);
          elementRef.current.style.filter = "";
        }
        animationFrameId.current = requestAnimationFrame(checkIllumination);
        return;
      }
      
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      const dx = mousePosition.x - elementCenterX;
      const dy = mousePosition.y - elementCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // L'élément est illuminé s'il est suffisamment proche de la torche
      const isElementIlluminated = distance < 200;
      
      // Appliquer les effets visuels si l'élément est illuminé
      if (isElementIlluminated && isTorchActive) {
        if (!isIlluminated) {
          elementRef.current.style.transition = "filter 0.2s ease-out";
          setIsIlluminated(true);
        }
        
        if (is3DModeActive) {
          elementRef.current.style.filter = "brightness(1.2) drop-shadow(0 0 10px rgba(255, 221, 68, 0.3))";
        } else {
          elementRef.current.style.filter = "brightness(1.1) drop-shadow(0 0 5px rgba(255, 221, 68, 0.2))";
        }
      } else if (isIlluminated) {
        elementRef.current.style.filter = "";
        setIsIlluminated(false);
      }
      
      animationFrameId.current = requestAnimationFrame(checkIllumination);
    };
    
    // Démarrer l'animation frame
    animationFrameId.current = requestAnimationFrame(checkIllumination);
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (elementRef.current) {
        elementRef.current.style.filter = "";
      }
    };
  }, [isTorchActive, is3DModeActive, isIlluminated]);

  // Mise à jour moins fréquente pour la position de la souris
  useEffect(() => {
    if (isTorchActive && isIlluminated && elementRef.current) {
      const now = performance.now();
      if (now - lastCheckTime.current > 100) { // Vérifier toutes les 100ms pour la position
        lastCheckTime.current = now;
        
        const rect = elementRef.current.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        
        const dx = mousePosition.x - elementCenterX;
        const dy = mousePosition.y - elementCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 200 && isIlluminated) {
          elementRef.current.style.filter = "";
          setIsIlluminated(false);
        }
      }
    }
  }, [mousePosition, isTorchActive, isIlluminated]);

  return { ref: elementRef, isIlluminated };
};
