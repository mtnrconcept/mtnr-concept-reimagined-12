
import React, { createContext, useContext, useState, useRef, useEffect, useLayoutEffect } from "react";

interface TorchContextType {
  isTorchActive: boolean;
  setIsTorchActive: (active: boolean) => void;
  mousePosition: { x: number; y: number };
  updateMousePosition: (position: { x: number; y: number }) => void;
  registerElementForIllumination: (element: HTMLElement) => void;
  unregisterElementForIllumination: (element: HTMLElement) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const TorchContext = createContext<TorchContextType>({
  isTorchActive: false,
  setIsTorchActive: () => {},
  mousePosition: { x: 0, y: 0 },
  updateMousePosition: () => {},
  registerElementForIllumination: () => {},
  unregisterElementForIllumination: () => {},
  containerRef: { current: null },
});

export const useTorch = () => useContext(TorchContext);

export const TorchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTorchActive, setIsTorchActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [elementsToIlluminate, setElementsToIlluminate] = useState<HTMLElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateMousePosition = (position: { x: number; y: number }) => {
    setMousePosition(position);
  };

  const registerElementForIllumination = (element: HTMLElement) => {
    setElementsToIlluminate(prev => {
      if (prev.includes(element)) return prev;
      return [...prev, element];
    });
  };

  const unregisterElementForIllumination = (element: HTMLElement) => {
    setElementsToIlluminate(prev => prev.filter(el => el !== element));
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

  useLayoutEffect(() => {
    if (!isTorchActive) return;

    elementsToIlluminate.forEach(el => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;
      
      const dx = elCenterX - mousePosition.x;
      const dy = elCenterY - mousePosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const norm = Math.max(distance, 1);
      
      const shadowLength = 50 + Math.min(distance, 200);
      const offsetX = (dx / norm) * shadowLength;
      const offsetY = (dy / norm) * shadowLength;
      const blurRadius = 20 + (distance / 10);
      
      el.style.boxShadow = `${offsetX}px ${offsetY}px ${blurRadius}px rgba(0, 0, 0, 0.5)`;
    });

    return () => {
      elementsToIlluminate.forEach(el => {
        el.style.boxShadow = "";
      });
    };
  }, [mousePosition, elementsToIlluminate, isTorchActive]);

  const radius = 400;
  
  const contextValue = {
    isTorchActive,
    setIsTorchActive,
    mousePosition,
    updateMousePosition,
    registerElementForIllumination,
    unregisterElementForIllumination,
    containerRef,
  };

  return (
    <TorchContext.Provider value={contextValue}>
      <div ref={containerRef} className="torch-container relative w-full h-full overflow-hidden">
        {children}
        {isTorchActive && (
          <svg className="fixed top-0 left-0 w-full h-full z-[9999] pointer-events-none">
            <defs>
              <radialGradient id="torch-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="black" stopOpacity="1" />
                <stop offset="70%" stopColor="black" stopOpacity="0.3" />
                <stop offset="100%" stopColor="black" stopOpacity="0" />
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

export const useIlluminated = () => {
  const { registerElementForIllumination, unregisterElementForIllumination, isTorchActive } = useTorch();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      registerElementForIllumination(ref.current);
      return () => {
        if (ref.current) unregisterElementForIllumination(ref.current);
      };
    }
  }, [registerElementForIllumination, unregisterElementForIllumination]);

  return { ref, isTorchActive };
};
