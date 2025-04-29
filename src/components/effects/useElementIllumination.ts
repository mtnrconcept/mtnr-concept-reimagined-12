
import { useState, useRef, useEffect, useCallback } from "react";
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";

export function useElementIllumination() {
  const [elementsToIlluminate, setElementsToIlluminate] = useState<HTMLElement[]>([]);
  const { mousePosition, isTorchActive } = useTorch();
  const { uvMode } = useUVMode();

  const registerElementForIllumination = useCallback((element: HTMLElement) => {
    setElementsToIlluminate(prev => {
      if (prev.includes(element)) return prev;
      return [...prev, element];
    });
  }, []);

  const unregisterElementForIllumination = useCallback((element: HTMLElement) => {
    setElementsToIlluminate(prev => prev.filter(el => el !== element));
  }, []);

  // Apply illumination effects
  useEffect(() => {
    if (!isTorchActive) return;

    elementsToIlluminate.forEach(el => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;
      
      const dx = elCenterX - mousePosition.x;
      const dy = elCenterY - mousePosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const norm = Math.max(distance, 1);
      
      const shadowLength = 50 + Math.min(distance, 200);
      const offsetX = (dx / norm) * shadowLength;
      const offsetY = (dy / norm) * shadowLength;
      const blurRadius = 20 + (distance / 10);
      
      if (uvMode) {
        // Enhanced effect in UV mode with blue neon color
        el.style.boxShadow = `${offsetX}px ${offsetY}px ${blurRadius}px rgba(0, 170, 255, 0.7)`;
        el.style.transition = "box-shadow 0.3s ease-out";
      } else {
        el.style.boxShadow = `${offsetX}px ${offsetY}px ${blurRadius}px rgba(0, 0, 0, 0.5)`;
      }
    });

    return () => {
      elementsToIlluminate.forEach(el => {
        el.style.boxShadow = "";
      });
    };
  }, [mousePosition, elementsToIlluminate, isTorchActive, uvMode]);

  return {
    registerElementForIllumination,
    unregisterElementForIllumination
  };
}

export const useIlluminated = () => {
  const { registerElementForIllumination, unregisterElementForIllumination } = useElementIllumination();
  const { isTorchActive } = useTorch();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      registerElementForIllumination(ref.current);
      return () => {
        if (ref.current) unregisterElementForIllumination(ref.current);
      };
    }
  }, [registerElementForIllumination, unregisterElementForIllumination]);

  return { ref, isTorchActive };
};
