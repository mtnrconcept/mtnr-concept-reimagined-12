
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
  const [mousePosition, setMousePosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
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
      document.documentElement.style.setProperty('--mx', `${position.x}px`);
      document.documentElement.style.setProperty('--my', `${position.y}px`);
    }
  };

  // Handle mouse movement with improved performance
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isTorchActive) {
        // Utilisation de requestAnimationFrame pour limiter les mises à jour
        window.requestAnimationFrame(() => {
          updateMousePosition({ x: e.clientX, y: e.clientY });
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    // En cas d'écran noir, on force un mouvement initial de souris
    if (isTorchActive) {
      updateMousePosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }

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
  }, [isTorchActive, uvMode, createUVCircle, removeUVCircle]);

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
          <div 
            className="standard-torch"
            style={{
              mask: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 500px)`,
              WebkitMask: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, black 500px)`
            }}
          />
        )}
      </div>
    </TorchContext.Provider>
  );
};

// Re-export useIlluminated for backward compatibility
export { useIlluminated } from './useElementIllumination';
