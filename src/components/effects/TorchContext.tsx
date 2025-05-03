
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { useUVMode } from "./UVModeContext";

interface TorchContextType {
  isTorchActive: boolean;
  setIsTorchActive: (active: boolean) => void;
  mousePosition: { x: number; y: number };
  updateMousePosition: (position: { x: number; y: number }) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const TorchContext = createContext<TorchContextType>({
  isTorchActive: false,
  setIsTorchActive: () => {},
  mousePosition: { x: 0, y: 0 },
  updateMousePosition: () => {},
  containerRef: { current: null },
});

export const useTorch = () => useContext(TorchContext);

export const TorchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTorchActive, setIsTorchActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    uvMode, 
    uvCircleRef, 
    createUVCircle, 
    removeUVCircle 
  } = useUVMode();

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
  }, [isTorchActive, uvMode, mousePosition, createUVCircle, removeUVCircle]);

  const contextValue = {
    isTorchActive,
    setIsTorchActive,
    mousePosition,
    updateMousePosition,
    containerRef,
  };

  return (
    <TorchContext.Provider value={contextValue}>
      <div ref={containerRef} className="torch-container relative w-full h-full overflow-hidden">
        {children}
        {isTorchActive && !uvMode && (
          <svg className="fixed top-0 left-0 w-full h-full z-[99] pointer-events-none">
            <defs>
              <mask id="torch-mask">
                <rect width="100%" height="100%" fill="black" />
                <circle
                  cx={mousePosition.x}
                  cy={mousePosition.y}
                  r={600}
                  fill="white"
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
