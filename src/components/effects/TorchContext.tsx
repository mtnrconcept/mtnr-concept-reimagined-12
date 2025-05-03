
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
    {/* Gradient doux pour le cône */}
    <radialGradient id="torch-gradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="white" stopOpacity="1" />
      <stop offset="50%" stopColor="white" stopOpacity="0.4" />
      <stop offset="100%" stopColor="white" stopOpacity="0" />
    </radialGradient>

    <mask id="torch-mask">
      {/* Fond noir = masqué */}
      <rect width="100%" height="100%" fill="black" />

      {/* Cône lumineux doux */}
      <ellipse
        cx={mousePosition.x}
        cy={mousePosition.y - 150}
        rx="200"
        ry="500"
        fill="url(#torch-gradient)"
      />
    </mask>
  </defs>

  {/* Calque noir à 70 %, percé par le faisceau */}
  <rect
    width="100%"
    height="100%"
    fill="black"
    fillOpacity="0.7"
    mask="url(#torch-mask)"
    style={{ transition: "all 0.2s ease-out" }}
  />

  {/* (optionnel) ajout d’un léger halo jaune-blanc dans le cône */}
  <ellipse
    cx={mousePosition.x}
    cy={mousePosition.y - 150}
    rx="200"
    ry="500"
    fill="url(#torch-gradient)"
    style={{
      pointerEvents: "none",
      mixBlendMode: "screen",
      opacity: 0.15,
    }}
  />
</svg>




        )}
      </div>
    </TorchContext.Provider>
  );
};

// Re-export useIlluminated for backward compatibility
export { useIlluminated } from './useElementIllumination';
