import { useState, useRef, useEffect, useCallback } from "react";
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";

export function useElementIllumination() {
  const [elementsToIlluminate, setElementsToIlluminate] = useState<HTMLElement[]>([]);
  const { mousePosition, isTorchActive } = useTorch();
  const { uvMode } = useUVMode();

  const registerElementForIllumination = useCallback((element: HTMLElement) => {
    setElementsToIlluminate((prev) => {
      if (prev.includes(element)) return prev;
      return [...prev, element];
    });
  }, []);

  const unregisterElementForIllumination = useCallback((element: HTMLElement) => {
    setElementsToIlluminate((prev) => prev.filter((el) => el !== element));
  }, []);

  useEffect(() => {
    if (!isTorchActive) return;

    elementsToIlluminate.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;

      // Ignore si l'élément est hors écran
      if (
        rect.bottom < 0 || rect.top > window.innerHeight ||
        rect.right < 0 || rect.left > window.innerWidth
      ) {
        el.style.boxShadow = "";
        el.style.opacity = "";
        return;
      }

      const dx = elCenterX - mousePosition.x;
      const dy = elCenterY - mousePosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const norm = Math.max(distance, 1);

      const shadowLength = 50 + Math.min(distance, 200);
      const offsetX = (dx / norm) * shadowLength;
      const offsetY = (dy / norm) * shadowLength;
      const blurRadius = 20 + (distance / 10);

      // Ajustement de l'opacité selon la distance
      const distanceRatio = Math.min(distance / 500, 1); // 0 (proche) → 1 (loin)
      const adjustedOpacity = 1 - distanceRatio * 0.5; // 1 → 0.5

      el.style.transition = "box-shadow 0.3s ease-out, opacity 0.3s ease-out";

      if (uvMode) {
        el.style.boxShadow = `
          ${offsetX}px ${offsetY}px ${blurRadius}px rgba(0, 170, 255, 0.6),
          0 0 15px rgba(0, 170, 255, 0.4),
          0 0 30px rgba(0, 170, 255, 0.2)
        `;
        el.style.opacity = "1";
      } else {
        el.style.boxShadow = `${offsetX}px ${offsetY}px ${blurRadius}px rgba(0, 0, 0, 0.5)`;
        el.style.opacity = adjustedOpacity.toString();
      }
    });

    return () => {
      elementsToIlluminate.forEach((el) => {
        el.style.boxShadow = "";
        el.style.opacity = "";
      });
    };
  }, [mousePosition, elementsToIlluminate, isTorchActive, uvMode]);

  return {
    registerElementForIllumination,
    unregisterElementForIllumination,
  };
}

export const useIlluminated = () => {
  const { registerElementForIllumination, unregisterElementForIllumination } =
    useElementIllumination();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      registerElementForIllumination(ref.current);
      return () => {
        unregisterElementForIllumination(ref.current);
      };
    }
  }, [registerElementForIllumination, unregisterElementForIllumination]);

  return { ref };
};
