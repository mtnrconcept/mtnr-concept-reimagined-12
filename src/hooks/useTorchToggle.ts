
import { useCallback, useRef } from "react";
import { useTorch } from "@/components/effects/TorchContext";
import { useUVMode } from "@/components/effects/UVModeContext";

export function useTorchToggle() {
  const { isTorchActive, setIsTorchActive } = useTorch();
  const { uvMode, toggleUVMode } = useUVMode();
  const isHandlingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timeouts
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handleToggleTorch = useCallback(() => {
    // Avoid rapid multiple clicks
    if (isHandlingRef.current) return;
    isHandlingRef.current = true;
    
    // Toggle standard torch
    setIsTorchActive(!isTorchActive);
    
    // If UV mode is active and we're turning off the torch, disable UV mode too
    if (isTorchActive && uvMode) {
      toggleUVMode();
    }
    
    console.log(`Torch toggled: ${!isTorchActive}`);
    
    // Reset flag after delay
    timeoutRef.current = setTimeout(() => {
      isHandlingRef.current = false;
    }, 300);
  }, [isTorchActive, uvMode, setIsTorchActive, toggleUVMode]);

  const handleToggleUV = useCallback(() => {
    // Avoid rapid multiple clicks
    if (isHandlingRef.current) return;
    isHandlingRef.current = true;
    
    // Vibration for tactile feedback if available
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(50);
      } catch (e) {
        console.warn("Vibration not supported:", e);
      }
    }

    // If activating UV mode, ensure torch is also active
    if (!uvMode) {
      // Activate torch if not already active
      if (!isTorchActive) {
        setIsTorchActive(true);
      }
      
      // Add delay to ensure torch is activated before UV mode
      timeoutRef.current = setTimeout(() => {
        toggleUVMode();
        console.log("UV mode on, torch activated");
        
        // Reset flag
        timeoutRef.current = setTimeout(() => {
          isHandlingRef.current = false;
        }, 300);
      }, 100);
    } else {
      // If disabling UV mode, leave standard torch active
      toggleUVMode();
      console.log("UV mode off, torch remains active");
      
      // Reset flag
      timeoutRef.current = setTimeout(() => {
        isHandlingRef.current = false;
      }, 300);
    }
  }, [isTorchActive, uvMode, setIsTorchActive, toggleUVMode]);

  return {
    isTorchActive,
    uvMode,
    isHandlingRef,
    handleToggleTorch,
    handleToggleUV,
    cleanup
  };
}
