
import { useEffect, useRef } from "react";
import { useTorch } from "@/components/effects/TorchContext";
import { use3DTorch } from "@/components/effects/Torch3DContext";

export const useIlluminatedElement = () => {
  const elementRef = useRef<HTMLElement>(null);
  const { isTorchActive } = useTorch();
  const { is3DModeActive } = use3DTorch();

  useEffect(() => {
    if (!elementRef.current) return;
    
    // Add shadows and illumination effects when torch is active
    if (isTorchActive && is3DModeActive) {
      elementRef.current.style.transition = "filter 0.2s ease-out";
      elementRef.current.style.filter = "brightness(1.2) drop-shadow(0 0 10px rgba(255, 221, 68, 0.3))";
    } else {
      elementRef.current.style.filter = "";
    }
  }, [isTorchActive, is3DModeActive]);

  return elementRef;
};
