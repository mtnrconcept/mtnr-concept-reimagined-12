
import { useState, useEffect } from "react";

interface UseTorchMouseTrackingProps {
  isTorchActive: boolean;
  updateMousePosition: (position: { x: number; y: number }) => void;
}

export function useTorchMouseTracking({ 
  isTorchActive, 
  updateMousePosition 
}: UseTorchMouseTrackingProps) {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isTorchActive) {
        updateMousePosition({ x: e.clientX, y: e.clientY });
      }
    };
    
    // Also track touch events for mobile devices
    const handleTouchMove = (e: TouchEvent) => {
      if (isTorchActive && e.touches.length > 0) {
        e.preventDefault(); // Prevent scrolling while using torch
        const touch = e.touches[0];
        updateMousePosition({ x: touch.clientX, y: touch.clientY });
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isTorchActive, updateMousePosition]);
}
