
import { useEffect, useRef } from "react";
import { useIsMobile } from "./use-mobile";

export interface MousePosition {
  x: number;
  y: number;
}

export function useTorchPosition(
  isTorchActive: boolean,
  updateMousePosition: (position: MousePosition) => void,
  initialPosition: MousePosition = { x: 0, y: 0 }
) {
  const isMobile = useIsMobile();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Mouse tracking for desktop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isTorchActive) {
        updateMousePosition({ x: e.clientX, y: e.clientY });
      }
    };
    
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isTorchActive, isMobile, updateMousePosition]);

  // Touch tracking for mobile
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isTorchActive && e.touches.length > 0) {
        e.preventDefault(); // Prevent scrolling when torch is active
        updateMousePosition({ 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isTorchActive && e.touches.length > 0) {
        updateMousePosition({ 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        });
      }
    };

    // Nouveau gestionnaire pour capturer tous les événements tactiles pendant le défilement
    const handleScrollTouchMove = (e: TouchEvent) => {
      if (isTorchActive && e.touches.length > 0) {
        // Ne pas empêcher le défilement ici, mais mettre à jour la position
        updateMousePosition({ 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        });
      }
    };

    // Gestion des événements tactiles pendant le défilement
    const handleScroll = () => {
      if (isTorchActive) {
        // Ajouter temporairement un écouteur non-passif qui capture les mouvements pendant le défilement
        document.addEventListener("touchmove", handleScrollTouchMove, { passive: true });
        
        // Nettoyer l'écouteur après un court délai après la fin du défilement
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          document.removeEventListener("touchmove", handleScrollTouchMove);
        }, 150);
      }
    };

    if (isMobile) {
      // Écouter les événements tactiles standards
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchstart", handleTouchStart);
      
      // Écouter également l'événement de défilement
      window.addEventListener("scroll", handleScroll);
      
      return () => {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener("touchmove", handleScrollTouchMove);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [isTorchActive, isMobile, updateMousePosition]);
  
  return { scrollTimeoutRef };
}
