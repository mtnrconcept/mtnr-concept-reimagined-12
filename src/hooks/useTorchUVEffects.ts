
import { useEffect, useRef } from "react";
import { useUVMode } from "../components/effects/UVModeContext";

interface UseTorchUVEffectsProps {
  isTorchActive: boolean;
  mousePosition: { x: number; y: number };
  isInitialMount: React.MutableRefObject<boolean>;
}

export function useTorchUVEffects({
  isTorchActive,
  mousePosition,
  isInitialMount
}: UseTorchUVEffectsProps) {
  const { uvMode, uvCircleRef, createUVCircle, removeUVCircle } = useUVMode();
  const isProcessingRef = useRef(false);

  useEffect(() => {
    // Skip if already processing to avoid performance issues
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    // If it's first mount, wait a bit for other components to load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setTimeout(() => {
        applyTorchEffects();
        isProcessingRef.current = false;
      }, 200);
    } else {
      // Normal logic for subsequent renders
      applyTorchEffects();
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 50);
    }

    function applyTorchEffects() {
      if (isTorchActive && uvMode) {
        createUVCircle(mousePosition);
        document.body.classList.add('torch-active');
        document.body.classList.add('uv-torch-active');
      } else if (isTorchActive && !uvMode) {
        document.body.classList.add('torch-active');
        document.body.classList.remove('uv-torch-active');
        removeUVCircle();
      } else {
        document.body.classList.remove('torch-active');
        document.body.classList.remove('uv-torch-active');
        removeUVCircle();
      }
    }
    
    return () => {
      document.body.classList.remove('torch-active');
      document.body.classList.remove('uv-torch-active');
      removeUVCircle();
      isProcessingRef.current = false;
    };
  }, [isTorchActive, uvMode, mousePosition, createUVCircle, removeUVCircle]);

  // Update UV circle position whenever mouse position changes
  useEffect(() => {
    if (uvCircleRef.current && uvMode && isTorchActive) {
      uvCircleRef.current.style.left = `${mousePosition.x}px`;
      uvCircleRef.current.style.top = `${mousePosition.y}px`;
    }
  }, [mousePosition, uvMode, isTorchActive, uvCircleRef]);

  return { uvMode };
}
