
import React, { createContext, useContext, useState, useRef, ReactNode, useMemo, useCallback } from "react";
import { useUVMode } from "./UVModeContext";
import { FlashlightOverlay } from "./FlashlightOverlay";
import { useTorchPosition } from "@/hooks/useTorchPosition";
import { useUVEffects } from "@/hooks/useUVEffects";
import { FlashlightIcon } from "./FlashlightIcon";
import { useTorchScroll } from "@/hooks/useTorchScroll";

interface TorchContextType {
  isTorchActive: boolean;
  setIsTorchActive: (active: boolean) => void;
  mousePosition: { x: number; y: number };
  updateMousePosition: (position: { x: number; y: number }) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  isFingerDown: boolean;
  setIsFingerDown: (isDown: boolean) => void;
}

const TorchContext = createContext<TorchContextType>({
  isTorchActive: false,
  setIsTorchActive: () => {},
  mousePosition: { x: 0, y: 0 },
  updateMousePosition: () => {},
  containerRef: { current: null },
  isFingerDown: true,
  setIsFingerDown: () => {},
});

export const useTorch = () => useContext(TorchContext);

export const TorchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTorchActive, setIsTorchActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFingerDown, setIsFingerDown] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { uvMode, uvCircleRef } = useUVMode();
  
  // Optimiser avec un useCallback pour éviter les recréations inutiles
  const updateMousePosition = useCallback((position: { x: number; y: number }) => {
    setMousePosition(position);
    if (uvCircleRef.current && uvMode) {
      uvCircleRef.current.style.left = `${position.x}px`;
      uvCircleRef.current.style.top = `${position.y}px`;
    }
  }, [uvMode, uvCircleRef]);

  // Utiliser nos hooks optimisés
  useTorchPosition(isTorchActive, updateMousePosition, mousePosition, setIsFingerDown);
  useUVEffects(isTorchActive, mousePosition);
  useTorchScroll({ isTorchActive, mousePosition, isFingerDown });

  // Optimiser le contexte avec useMemo pour réduire les recréations
  const contextValue = useMemo(() => ({
    isTorchActive,
    setIsTorchActive,
    mousePosition,
    updateMousePosition,
    containerRef,
    isFingerDown,
    setIsFingerDown,
  }), [isTorchActive, mousePosition, updateMousePosition, isFingerDown]);

  return (
    <TorchContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        style={{ position: "relative", zIndex: 0 }}
      >
        {children}
      </div>

      {/* Optimize render with conditional code */}
      {isTorchActive && (
        <>
          <FlashlightOverlay 
            isTorchActive={isTorchActive}
            uvMode={uvMode}
            mousePosition={mousePosition}
          />
  
          <FlashlightIcon
            isTorchActive={isTorchActive}
            mousePosition={mousePosition}
            uvMode={uvMode}
            isFingerDown={isFingerDown}
          />
        </>
      )}
    </TorchContext.Provider>
  );
};

// Re-export hook
export { useIlluminated } from "./useElementIllumination";
