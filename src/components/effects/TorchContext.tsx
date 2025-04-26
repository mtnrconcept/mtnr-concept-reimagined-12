
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

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

interface TorchProviderProps {
  children: React.ReactNode;
}

export const TorchProvider: React.FC<TorchProviderProps> = ({ children }) => {
  const [isTorchActive, setIsTorchActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const updateMousePosition = (position: { x: number; y: number }) => {
    setMousePosition(position);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isTorchActive) {
        updateMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTorchActive]);

  const contextValue = {
    isTorchActive,
    setIsTorchActive,
    mousePosition,
    updateMousePosition,
    containerRef,
  };

  const radius = 300;

  return (
    <TorchContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className="torch-container relative w-full h-full overflow-hidden"
      >
        {children}
        {isTorchActive && (
          <svg
            className="fixed top-0 left-0 w-full h-full z-[9999] pointer-events-none"
            style={{ mixBlendMode: "multiply" }}
          >
            <defs>
              <radialGradient id="torch-gradient">
                <stop offset="30%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="black" stopOpacity="1" />
              </radialGradient>
              <mask id="torch-mask">
                <rect width="100%" height="100%" fill="black" />
                <circle
                  cx={mousePosition.x}
                  cy={mousePosition.y}
                  r={radius}
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
