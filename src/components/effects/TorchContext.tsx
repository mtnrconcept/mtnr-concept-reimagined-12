
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from "react";
import { useTorchMouseTracking } from "@/hooks/useTorchMouseTracking";
import { useTorchUVEffects } from "@/hooks/useTorchUVEffects";
import { useNearbyUVElements } from "@/hooks/useNearbyUVElements";
import { TorchMask } from "./TorchMask";

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

export const TorchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTorchActive, setIsTorchActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Handler for updating mouse position
  const updateMousePosition = (position: { x: number; y: number }) => {
    setMousePosition(position);
  };

  // Use our new hooks
  useTorchMouseTracking({ isTorchActive, updateMousePosition });
  
  const { uvMode } = useTorchUVEffects({ 
    isTorchActive, 
    mousePosition,
    isInitialMount
  });
  
  useNearbyUVElements({
    isTorchActive,
    uvMode,
    mousePosition
  });

  const contextValue: TorchContextType = {
    isTorchActive,
    setIsTorchActive,
    mousePosition,
    updateMousePosition,
    containerRef,
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

      {/* Use our new TorchMask component */}
      <TorchMask 
        isTorchActive={isTorchActive}
        mousePosition={mousePosition}
        uvMode={uvMode}
      />
    </TorchContext.Provider>
  );
};

// Re-export hook
export { useIlluminated } from "./useElementIllumination";
