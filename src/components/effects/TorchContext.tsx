
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
  const isInitialMount = useRef(true);

  const { uvMode, uvCircleRef, createUVCircle, removeUVCircle } = useUVMode();

  const updateMousePosition = (position: { x: number; y: number }) => {
    setMousePosition(position);
    if (uvCircleRef.current && uvMode) {
      uvCircleRef.current.style.left = `${position.x}px`;
      uvCircleRef.current.style.top = `${position.y}px`;
    }
    
    // Trigger browser repaints for UV elements nearby
    if (uvMode) {
      const uvElements = document.querySelectorAll('.uv-hidden-code, .uv-hidden-message, .uv-secret-message, .decrypt-message');
      uvElements.forEach(el => {
        if (el instanceof HTMLElement) {
          const rect = el.getBoundingClientRect();
          const dx = position.x - (rect.left + rect.width/2);
          const dy = position.y - (rect.top + rect.height/2);
          const distance = Math.sqrt(dx*dx + dy*dy);
          
          // Forcer un repaint pour les éléments proches
          if (distance < 300) {
            el.style.opacity = el.style.opacity; // Astuce pour forcer un repaint
            
            // Rendre l'élément visible s'il est suffisamment proche
            if (distance < 150) {
              el.classList.add('active');
            } else {
              el.classList.remove('active');
            }
          }
        }
      });
    }
  };

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isTorchActive) {
        updateMousePosition({ x: e.clientX, y: e.clientY });
      }
    };
    
    // Également suivre les événements tactiles pour les appareils mobiles
    const handleTouchMove = (e: TouchEvent) => {
      if (isTorchActive && e.touches.length > 0) {
        e.preventDefault(); // Empêcher le défilement pendant l'utilisation de la torche
        const touch = e.touches[0];
        updateMousePosition({ x: touch.clientX, y: touch.clientY });
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isTorchActive]);

  // UV logic
  useEffect(() => {
    // Si c'est le premier montage, attendre un peu pour laisser les autres composants se charger
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setTimeout(() => {
        // Appliquer la logique normale après un délai
        if (isTorchActive && uvMode) {
          createUVCircle(mousePosition);
          document.body.classList.add('torch-active');
          document.body.classList.add('uv-torch-active');
        } else if (isTorchActive && !uvMode) {
          document.body.classList.add('torch-active');
          document.body.classList.remove('uv-torch-active');
          removeUVCircle();
        } else {
          document.body.classList.remove('torch-active');
          document.body.classList.remove('uv-torch-active');
          removeUVCircle();
        }
      }, 200);
    } else {
      // Logique normale pour les rendus suivants
      if (isTorchActive && uvMode) {
        createUVCircle(mousePosition);
        document.body.classList.add('torch-active');
        document.body.classList.add('uv-torch-active');
      } else if (isTorchActive && !uvMode) {
        document.body.classList.add('torch-active');
        document.body.classList.remove('uv-torch-active');
        removeUVCircle();
      } else {
        document.body.classList.remove('torch-active');
        document.body.classList.remove('uv-torch-active');
        removeUVCircle();
      }
    }
    
    return () => {
      document.body.classList.remove('torch-active');
      document.body.classList.remove('uv-torch-active');
      removeUVCircle();
    };
  }, [isTorchActive, uvMode, mousePosition, createUVCircle, removeUVCircle]);

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

      {/* Masque de la torche normale - toujours affiché quand la torche est active, même en mode UV */}
      {isTorchActive &&
        createPortal(
          <div 
            className="fixed inset-0 z-[99] pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 350px 550px at ${mousePosition.x}px ${mousePosition.y}px, 
                rgba(0,0,0,0) 0%, 
                rgba(0,0,0,0.6) 40%, 
                rgba(0,0,0,0.7) 60%,
                rgba(0,0,0,0.7) 80%,
                rgba(0,0,0,0.9) 100%)`,
              mixBlendMode: 'normal',
              transition: 'all 0.05s ease-out',
              opacity: uvMode ? '0.7' : '1', // Réduire l'opacité en mode UV mais toujours visible
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
