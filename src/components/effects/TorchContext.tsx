
import React, { createContext, useContext, useState, useRef, useEffect, useLayoutEffect } from "react";

interface TorchContextType {
  isTorchActive: boolean;
  setIsTorchActive: (active: boolean) => void;
  mousePosition: { x: number; y: number };
  updateMousePosition: (position: { x: number; y: number }) => void;
  registerElementForIllumination: (element: HTMLElement) => void;
  unregisterElementForIllumination: (element: HTMLElement) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  uvMode: boolean;
  toggleUVMode: () => void;
}

const TorchContext = createContext<TorchContextType>({
  isTorchActive: false,
  setIsTorchActive: () => {},
  mousePosition: { x: 0, y: 0 },
  updateMousePosition: () => {},
  registerElementForIllumination: () => {},
  unregisterElementForIllumination: () => {},
  containerRef: { current: null },
  uvMode: false,
  toggleUVMode: () => {},
});

export const useTorch = () => useContext(TorchContext);

export const TorchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTorchActive, setIsTorchActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [elementsToIlluminate, setElementsToIlluminate] = useState<HTMLElement[]>([]);
  const [uvMode, setUVMode] = useState(false);
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
  
  const toggleUVMode = () => {
    setUVMode(prev => !prev);
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

  // Appliquer un effet global sur le document lorsque le mode UV est activé
  useEffect(() => {
    if (isTorchActive && uvMode) {
      // Ajouter une classe au body pour les styles globaux du mode UV
      document.body.classList.add('uv-mode-active');
      
      // Trouver tous les éléments de navigation et leur ajouter une lueur UV
      const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(link => {
        link.classList.add('uv-nav-link');
      });
      
      // Appliquer un effet aux boutons
      const buttons = document.querySelectorAll('button, a.btn, .btn, [role="button"]');
      buttons.forEach(button => {
        button.classList.add('uv-button');
      });
      
    } else {
      document.body.classList.remove('uv-mode-active');
      
      const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(link => {
        link.classList.remove('uv-nav-link');
      });
      
      const buttons = document.querySelectorAll('button, a.btn, .btn, [role="button"]');
      buttons.forEach(button => {
        button.classList.remove('uv-button');
      });
    }
    
    return () => {
      document.body.classList.remove('uv-mode-active');
      
      const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(link => {
        link.classList.remove('uv-nav-link');
      });
      
      const buttons = document.querySelectorAll('button, a.btn, .btn, [role="button"]');
      buttons.forEach(button => {
        button.classList.remove('uv-button');
      });
    };
  }, [isTorchActive, uvMode]);

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
      
      if (uvMode) {
        el.style.boxShadow = `${offsetX}px ${offsetY}px ${blurRadius}px rgba(0, 170, 255, 0.5)`;
      } else {
        el.style.boxShadow = `${offsetX}px ${offsetY}px ${blurRadius}px rgba(0, 0, 0, 0.5)`;
      }
    });

    return () => {
      elementsToIlluminate.forEach(el => {
        el.style.boxShadow = "";
      });
    };
  }, [mousePosition, elementsToIlluminate, isTorchActive, uvMode]);

  // Ajusté à 800 pour un effet plus large et doux comme sur l'image
  const radius = 800;
  
  const contextValue = {
    isTorchActive,
    setIsTorchActive,
    mousePosition,
    updateMousePosition,
    registerElementForIllumination,
    unregisterElementForIllumination,
    containerRef,
    uvMode,
    toggleUVMode,
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
              <radialGradient id="uv-torch-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0F0430" stopOpacity="0" />
                <stop offset="30%" stopColor="#150840" stopOpacity="0.1" />
                <stop offset="60%" stopColor="#170860" stopOpacity="0.3" />
                <stop offset="80%" stopColor="black" stopOpacity="0.7" />
                <stop offset="100%" stopColor="black" stopOpacity="0.95" />
              </radialGradient>
              <filter id="uv-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="15" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <mask id="torch-mask">
                <rect width="100%" height="100%" fill="white" />
                <circle
                  cx={mousePosition.x}
                  cy={mousePosition.y}
                  r={radius}
                  fill={uvMode ? "url(#uv-torch-gradient)" : "url(#torch-gradient)"}
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill={uvMode ? "rgba(10, 0, 60, 0.98)" : "rgba(0, 0, 0, 0.95)"}
              mask="url(#torch-mask)"
            />
            {/* Effet de halo UV autour du curseur si en mode UV */}
            {uvMode && (
              <>
                <circle
                  cx={mousePosition.x}
                  cy={mousePosition.y}
                  r="180"
                  fill="none"
                  stroke="#0066FF"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                  filter="blur(8px)"
                />
                <circle
                  cx={mousePosition.x}
                  cy={mousePosition.y}
                  r="30"
                  fill="#0066FF"
                  opacity="0.2"
                  filter="blur(12px)"
                />
              </>
            )}
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
