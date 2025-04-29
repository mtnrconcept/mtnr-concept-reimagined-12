
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { useUVMode } from "./UVModeContext";
import { useElementIllumination } from "./useElementIllumination";

interface TorchContextType {
  isTorchActive: boolean;
  setIsTorchActive: (active: boolean) => void;
  mousePosition: { x: number; y: number };
  updateMousePosition: (position: { x: number; y: number }) => void;
  registerElementForIllumination: (element: HTMLElement) => void;
  unregisterElementForIllumination: (element: HTMLElement) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  uvMode: boolean;
  toggleUVMode: () => void;
}

const TorchContext = createContext<TorchContextType>({
  isTorchActive: false,
  setIsTorchActive: () => {},
  mousePosition: { x: 0, y: 0 },
  updateMousePosition: () => {},
  registerElementForIllumination: () => {},
  unregisterElementForIllumination: () => {},
  containerRef: { current: null },
  uvMode: false,
  toggleUVMode: () => {},
});

export const useTorch = () => useContext(TorchContext);

export const TorchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTorchActive, setIsTorchActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    uvMode, 
    toggleUVMode, 
    uvCircleRef, 
    createUVCircle, 
    removeUVCircle 
  } = useUVMode();
  
  const { 
    registerElementForIllumination, 
    unregisterElementForIllumination 
  } = useElementIllumination();

  const updateMousePosition = (position: { x: number; y: number }) => {
    setMousePosition(position);
    
    // Update UV circle position if active
    if (uvCircleRef.current && uvMode) {
      uvCircleRef.current.style.left = `${position.x}px`;
      uvCircleRef.current.style.top = `${position.y}px`;
    }
  };

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isTorchActive) {
        updateMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTorchActive]);

  // Create UV circle when UV mode is activated
  useEffect(() => {
    if (isTorchActive && uvMode) {
      createUVCircle(mousePosition);
    } else {
      removeUVCircle();
    }
    
    return () => {
      removeUVCircle();
    };
  }, [isTorchActive, uvMode, mousePosition]);

  const contextValue = {
    isTorchActive,
    setIsTorchActive,
    mousePosition,
    updateMousePosition,
    registerElementForIllumination,
    unregisterElementForIllumination,
    containerRef,
    uvMode,
    toggleUVMode,
  };

  return (
    <TorchContext.Provider value={contextValue}>
      <div ref={containerRef} className="torch-container relative w-full h-full overflow-hidden">
        {children}
        {isTorchActive && !uvMode && (
          <svg className="fixed top-0 left-0 w-full h-full z-[9999] pointer-events-none">
            <defs>
              <radialGradient id="torch-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="black" stopOpacity="0" />
                <stop offset="70%" stopColor="black" stopOpacity="0.3" />
                <stop offset="100%" stopColor="black" stopOpacity="0.95" />
              </radialGradient>
              <mask id="torch-mask">
                <rect width="100%" height="100%" fill="white" />
                <circle
                  cx={mousePosition.x}
                  cy={mousePosition.y}
                  r={800}
                  fill="url(#torch-gradient)"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.95)"
              mask="url(#torch-mask)"
            />
          </svg>
        )}
      </div>
    </TorchContext.Provider>
  );
};

// Re-export useIlluminated for backward compatibility
export { useIlluminated } from './useElementIllumination';
