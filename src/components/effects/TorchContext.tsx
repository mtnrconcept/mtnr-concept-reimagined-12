
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

      {/* Masque de la torche */}
      {isTorchActive && !uvMode &&
        createPortal(
          <div 
            className="fixed inset-0 z-[99] pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 350px 550px at ${mousePosition.x}px ${mousePosition.y}px, 
                rgba(0,0,0,0) 0%, 
                rgba(0,0,0,0.6) 40%, 
                rgba(0,0,0,0.7) 60%,
                rgba(0,0,0,0.4) 80%,
                rgba(0,0,0,0.9) 100%)`,
              mixBlendMode: 'normal',
              transition: 'all 0.05s ease-out',
            }}
          >
            {/* Halo lumineux au centre */}
            <div 
              className="absolute pointer-events-none"
              style={{
                width: '650px',
                height: '650px',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                left: `${mousePosition.x}px`,
                top: `${mousePosition.y}px`,
                background: 'radial-gradient(ellipse, rgba(255,255,200,0.4) 0%, rgba(255,248,150,0.15) 60%, transparent 100%)',
                filter: 'blur(15px)',
                mixBlendMode: 'screen',
              }}
            />
          </div>,
          document.body
        )}
    </TorchContext.Provider>
  );
};

// Re-export hook
export { useIlluminated } from "./useElementIllumination";
