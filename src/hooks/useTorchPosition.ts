
import React, { useEffect, useRef, useCallback } from "react";
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
  const lastScrollPositionRef = useRef(0);
  const isScrollingRef = useRef(false);
  
  // Se souvenir de la position de défilement actuelle
  useEffect(() => {
    lastScrollPositionRef.current = window.scrollY;
  }, []);
  
  // Optimiser les gestionnaires pour qu'ils ne soient pas recréés à chaque render
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isTorchActive) {
      updateMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, [isTorchActive, updateMousePosition]);
  
  const handleMouseDown = useCallback(() => {
    if (setIsFingerDown) setIsFingerDown(true);
  }, [setIsFingerDown]);
  
  const handleMouseUp = useCallback(() => {
    if (setIsFingerDown) setIsFingerDown(false);
  }, [setIsFingerDown]);
  
  // Optimiser les gestionnaires tactiles pour qu'ils ne soient pas recréés à chaque render
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isTorchActive && e.touches.length > 0) {
      // Ne pas empêcher le comportement par défaut pour permettre le défilement natif
      e.stopPropagation();
      
      updateMousePosition({ 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      });
    }
  }, [isTorchActive, updateMousePosition]);
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isTorchActive && e.touches.length > 0) {
      if (setIsFingerDown) setIsFingerDown(true);
      updateMousePosition({ 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      });
    }
  }, [isTorchActive, updateMousePosition, setIsFingerDown]);
  
  const handleTouchEnd = useCallback(() => {
    if (setIsFingerDown) setIsFingerDown(false);
    isScrollingRef.current = false;
  }, [setIsFingerDown]);
  
  const handleScrollTouchMove = useCallback((e: TouchEvent) => {
    if (isTorchActive && e.touches.length > 0) {
      isScrollingRef.current = true;
      updateMousePosition({ 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      });
    }
  }, [isTorchActive, updateMousePosition]);

  const handleScroll = useCallback(() => {
    if (isTorchActive) {
      document.addEventListener("touchmove", handleScrollTouchMove, { passive: true });
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        document.removeEventListener("touchmove", handleScrollTouchMove);
        isScrollingRef.current = false;
      }, 150);
    }
  }, [isTorchActive, handleScrollTouchMove]);

  // Gestionnaires d'événements pour ordinateur
  useEffect(() => {
    if (isMobile) return;
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMobile, handleMouseMove, handleMouseDown, handleMouseUp]);

  // Gestionnaires d'événements pour mobile
  useEffect(() => {
    if (!isMobile) return;
    
    // Utiliser { passive: true } pour permettre le défilement natif
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("touchmove", handleScrollTouchMove);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isMobile, handleTouchMove, handleTouchStart, handleTouchEnd, handleScroll, handleScrollTouchMove]);
  
  return { scrollTimeoutRef, lastScrollPositionRef, isScrollingRef };
}
