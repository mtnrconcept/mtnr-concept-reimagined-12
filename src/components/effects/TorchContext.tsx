
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { uvMode, uvCircleRef, createUVCircle, removeUVCircle } = useUVMode();

  const updateMousePosition = (position: { x: number; y: number }) => {
    setMousePosition(position);
    if (uvCircleRef.current && uvMode) {
      uvCircleRef.current.style.left = `${position.x}px`;
      uvCircleRef.current.style.top = `${position.y}px`;
    }
  };

  // Mouse tracking for desktop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isTorchActive) {
        updateMousePosition({ x: e.clientX, y: e.clientY });
      }
    };
    
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isTorchActive, isMobile]);

  // Touch tracking for mobile
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isTorchActive && e.touches.length > 0) {
        e.preventDefault(); // Prevent scrolling when torch is active
        updateMousePosition({ 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isTorchActive && e.touches.length > 0) {
        updateMousePosition({ 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        });
      }
    };

    // Nouveau gestionnaire pour capturer tous les événements tactiles pendant le défilement
    const handleScrollTouchMove = (e: TouchEvent) => {
      if (isTorchActive && e.touches.length > 0) {
        // Ne pas empêcher le défilement ici, mais mettre à jour la position
        updateMousePosition({ 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        });
      }
    };

    // Gestion des événements tactiles pendant le défilement
    const handleScroll = () => {
      if (isTorchActive) {
        // Ajouter temporairement un écouteur non-passif qui capture les mouvements pendant le défilement
        document.addEventListener("touchmove", handleScrollTouchMove, { passive: true });
        
        // Nettoyer l'écouteur après un court délai après la fin du défilement
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          document.removeEventListener("touchmove", handleScrollTouchMove);
        }, 150);
      }
    };

    if (isMobile) {
      // Écouter les événements tactiles standards
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchstart", handleTouchStart);
      
      // Écouter également l'événement de défilement
      window.addEventListener("scroll", handleScroll);
      
      return () => {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener("touchmove", handleScrollTouchMove);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [isTorchActive, isMobile]);

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
                rgba(0,0,0,0.7) 80%,
                rgba(0,0,0,0.9) 100%)`,
              mixBlendMode: 'normal',
              transition: isMobile ? 'none' : 'all 0.05s ease-out',
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
                transition: isMobile ? 'none' : 'all 0.05s ease-out',
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
