
import { useEffect, useRef } from "react";
import { useIsMobile } from "./use-mobile";

export interface MousePosition {
  x: number;
  y: number;
}

export function useTorchPosition(
  isTorchActive: boolean,
  updateMousePosition: (position: MousePosition) => void,
  initialPosition: MousePosition = { x: 0, y: 0 },
  setIsFingerDown?: (isDown: boolean) => void
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
    
    const handleMouseDown = () => {
      if (setIsFingerDown) setIsFingerDown(true);
    };
    
    const handleMouseUp = () => {
      if (setIsFingerDown) setIsFingerDown(false);
    };
    
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isTorchActive, isMobile, updateMousePosition, setIsFingerDown]);

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
        if (setIsFingerDown) setIsFingerDown(true);
        updateMousePosition({ 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        });
      }
    };
    
    const handleTouchEnd = () => {
      if (setIsFingerDown) setIsFingerDown(false);
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
      window.addEventListener("touchend", handleTouchEnd);
      
      // Écouter également l'événement de défilement
      window.addEventListener("scroll", handleScroll);
      
      return () => {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener("touchmove", handleScrollTouchMove);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [isTorchActive, isMobile, updateMousePosition, setIsFingerDown]);
  
  return { scrollTimeoutRef };
}
