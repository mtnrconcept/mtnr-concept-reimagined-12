
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from "react";
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
  const [isFingerDown, setIsFingerDown] = useState(true); // Par défaut à true pour la compatibilité desktop
  const containerRef = useRef<HTMLDivElement>(null);
  const { uvMode, uvCircleRef } = useUVMode();
  
  const updateMousePosition = (position: { x: number; y: number }) => {
    setMousePosition(position);
    if (uvCircleRef.current && uvMode) {
      uvCircleRef.current.style.left = `${position.x}px`;
      uvCircleRef.current.style.top = `${position.y}px`;
    }
  };

  // Use our extracted hooks
  useTorchPosition(isTorchActive, updateMousePosition, mousePosition, setIsFingerDown);
  useUVEffects(isTorchActive, mousePosition);
  
  // Intégration du hook de défilement avec le nouvel état isFingerDown
  useTorchScroll({ isTorchActive, mousePosition, isFingerDown });

  const contextValue: TorchContextType = {
    isTorchActive,
    setIsTorchActive,
    mousePosition,
    updateMousePosition,
    containerRef,
    isFingerDown,
    setIsFingerDown,
  };

  return (
    <TorchContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        style={{ position: "relative", zIndex: 0 }}
      >
        {children}
      </div>

      {/* Flashlight mask overlay */}
      <FlashlightOverlay 
        isTorchActive={isTorchActive}
        uvMode={uvMode}
        mousePosition={mousePosition}
      />

      {/* New flashlight icon component */}
      <FlashlightIcon
        isTorchActive={isTorchActive}
        mousePosition={mousePosition}
        uvMode={uvMode}
        isFingerDown={isFingerDown}
      />
    </TorchContext.Provider>
  );
};

// Re-export hook
export { useIlluminated } from "./useElementIllumination";
