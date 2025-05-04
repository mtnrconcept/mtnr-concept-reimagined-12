
import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "./use-mobile";
import { useUVMode } from "../components/effects/UVModeContext";

interface MousePosition {
  x: number;
  y: number;
}

export function useUVEffects(isTorchActive: boolean, mousePosition: MousePosition) {
  const { uvMode, createUVCircle, removeUVCircle } = useUVMode();
  const neonEffectRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  
  // Optimize with useCallback to prevent recreation on every render
  const createNeonEffect = useCallback(() => {
    if (neonEffectRef.current) return;
    
    const neonEffect = document.createElement('div');
    neonEffect.className = 'uv-neon-effect';
    neonEffect.style.left = `${mousePosition.x}px`;
    neonEffect.style.top = `${mousePosition.y}px`;
    
    // Disable transitions on mobile for instant tracking
    if (isMobile) {
      neonEffect.style.transition = 'none';
    }
    
    document.body.appendChild(neonEffect);
    neonEffectRef.current = neonEffect;
  }, [mousePosition.x, mousePosition.y, isMobile]);
  
  const updateNeonPosition = useCallback(() => {
    if (!neonEffectRef.current) return;
    
    neonEffectRef.current.style.left = `${mousePosition.x}px`;
    neonEffectRef.current.style.top = `${mousePosition.y}px`;
  }, [mousePosition.x, mousePosition.y]);
  
  // Optimize cleanup with useCallback
  const cleanupEffects = useCallback(() => {
    removeUVCircle();
    if (neonEffectRef.current) {
      neonEffectRef.current.remove();
      neonEffectRef.current = null;
    }
  }, [removeUVCircle]);

  // Main effect for UV mode
  useEffect(() => {
    // Create or remove UV circle effect
    if (isTorchActive && uvMode) {
      createUVCircle(mousePosition);
      createNeonEffect();
      updateNeonPosition();
    } else {
      cleanupEffects();
    }
    
    return cleanupEffects;
  }, [isTorchActive, uvMode, mousePosition, createUVCircle, createNeonEffect, updateNeonPosition, cleanupEffects]);

  // Separate effect for position updates only
  useEffect(() => {
    if (isTorchActive && uvMode && neonEffectRef.current) {
      updateNeonPosition();
    }
  }, [isTorchActive, uvMode, mousePosition, updateNeonPosition]);

  return { neonEffectRef };
}
