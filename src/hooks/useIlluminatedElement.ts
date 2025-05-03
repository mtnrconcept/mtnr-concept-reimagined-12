
import { useEffect, useRef, useState } from "react";
import { useTorch } from "@/components/effects/TorchContext";
import { use3DTorch } from "@/components/effects/Torch3DContext";

export const useIlluminatedElement = () => {
  const elementRef = useRef<HTMLElement>(null);
  const { isTorchActive, mousePosition } = useTorch();
  const { is3DModeActive } = use3DTorch();
  const [isIlluminated, setIsIlluminated] = useState(false);

  useEffect(() => {
    if (!elementRef.current || !isTorchActive) {
      if (isIlluminated) {
        setIsIlluminated(false);
      }
      return;
    }
    
    const checkIllumination = () => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      const dx = mousePosition.x - elementCenterX;
      const dy = mousePosition.y - elementCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // L'élément est illuminé s'il est suffisamment proche de la torche
      const isElementIlluminated = distance < 200;
      
      // Appliquer les effets visuels si l'élément est illuminé
      if (isElementIlluminated && isTorchActive) {
        elementRef.current.style.transition = "filter 0.2s ease-out";
        
        if (is3DModeActive) {
          elementRef.current.style.filter = "brightness(1.2) drop-shadow(0 0 10px rgba(255, 221, 68, 0.3))";
        } else {
          elementRef.current.style.filter = "brightness(1.1) drop-shadow(0 0 5px rgba(255, 221, 68, 0.2))";
        }
        
        if (!isIlluminated) {
          setIsIlluminated(true);
        }
      } else {
        elementRef.current.style.filter = "";
        
        if (isIlluminated) {
          setIsIlluminated(false);
        }
      }
    };
    
    // Vérifier l'illumination immédiatement
    checkIllumination();
    
    // Vérifier à chaque mouvement de souris et à intervalles réguliers
    window.addEventListener('mousemove', checkIllumination);
    const intervalCheck = setInterval(checkIllumination, 100);
    
    return () => {
      window.removeEventListener('mousemove', checkIllumination);
      clearInterval(intervalCheck);
      if (elementRef.current) {
        elementRef.current.style.filter = "";
      }
    };
  }, [isTorchActive, is3DModeActive, mousePosition, isIlluminated]);

  return { ref: elementRef, isIlluminated };
};
