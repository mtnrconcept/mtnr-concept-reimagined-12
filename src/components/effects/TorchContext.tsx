import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
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

export const TorchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTorchActive, setIsTorchActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { uvMode, uvCircleRef, createUVCircle, removeUVCircle } = useUVMode();

  const updateMousePosition = (position: { x: number; y: number }) => {
    setMousePosition(position);
    if (uvCircleRef.current && uvMode) {
      uvCircleRef.current.style.left = `${position.x}px`;
      uvCircleRef.current.style.top = `${position.y}px`;
    }
  };

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isTorchActive) {
        updateMousePosition({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTorchActive]);

  // UV logic
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

      {/* Masque en dehors du flux DOM via portail */}
      {isTorchActive && !uvMode &&
        createPortal(
          <svg
            className="fixed inset-0 w-full h-full z-[99] pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="torch-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="50%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>

              <mask id="torch-mask">
                <rect width="100%" height="100%" fill="black" />
                <ellipse
                  cx={mousePosition.x}
                  cy={mousePosition.y - 150}
                  rx="200"
                  ry="500"
                  fill="url(#torch-gradient)"
                />
              </mask>
            </defs>

            {/* Calque noir semi-transparent percé par le faisceau */}
            <rect
              width="100%"
              height="100%"
              fill="black"
              fillOpacity="0.7"
              mask="url(#torch-mask)"
              style={{ transition: "all 0.2s ease-out" }}
            />

            {/* Halo doux dans le faisceau */}
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
          </svg>,
          document.body
        )}
    </TorchContext.Provider>
  );
};

// Re-export hook
export { useIlluminated } from "./useElementIllumination";
