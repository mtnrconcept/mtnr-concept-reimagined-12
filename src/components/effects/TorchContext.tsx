import React, { createContext, useContext, useState, useRef, ReactNode, useMemo, useCallback, useEffect } from "react";
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
  scrollPosition: number;
}

const TorchContext = createContext<TorchContextType>({
  isTorchActive: false,
  setIsTorchActive: () => {},
  mousePosition: { x: 0, y: 0 },
  updateMousePosition: () => {},
  containerRef: { current: null },
  isFingerDown: true,
  setIsFingerDown: () => {},
  scrollPosition: 0
});

export const useTorch = () => useContext(TorchContext);

export const TorchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTorchActive, setIsTorchActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isFingerDown, setIsFingerDown] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
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

  // Suivre la position de défilement actuelle
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Utiliser nos hooks optimisés
  useTorchPosition(isTorchActive, updateMousePosition, mousePosition, setIsFingerDown);
  useUVEffects(isTorchActive, mousePosition);
  useTorchScroll({ isTorchActive, mousePosition, isFingerDown });
  
  // Effet pour ajouter/supprimer la classe torch-active au body
  useEffect(() => {
    if (isTorchActive) {
      document.body.classList.add('torch-active');
      document.body.classList.add('allow-scroll'); 
      
      // Préserver la position de défilement existante
      const currentScrollY = window.scrollY;
      
      // Ajouter la classe content-scrollable aux conteneurs de contenu principaux
      document.querySelectorAll('.content-container').forEach(el => {
        el.classList.add('content-scrollable');
      });
      
      // Ajouter une classe spécifique aux pages problématiques pour augmenter leur z-index
      const currentPath = window.location.pathname;
      if (['/book', '/contact', '/what-we-do', '/artists'].includes(currentPath)) {
        document.querySelectorAll('main > div').forEach(el => {
          el.classList.add('page-content');
          
          // Ajouter une classe spécifique à la page
          if (currentPath === '/book') el.classList.add('page-book');
          else if (currentPath === '/contact') el.classList.add('page-contact');
          else if (currentPath === '/what-we-do') el.classList.add('page-what-we-do');
          else if (currentPath === '/artists') el.classList.add('page-artists');
        });
      }
      
      // S'assurer que la page ne remonte pas en haut
      window.scrollTo(0, currentScrollY);
    } else {
      document.body.classList.remove('torch-active');
      document.body.classList.add('allow-scroll');
      
      // Conserver la classe content-scrollable pour permettre le défilement
      document.querySelectorAll('.content-container').forEach(el => {
        el.classList.add('content-scrollable');
      });
      
      // Retirer les classes spécifiques aux pages
      document.querySelectorAll('.page-content').forEach(el => {
        el.classList.remove('page-content', 'page-book', 'page-contact', 'page-what-we-do', 'page-artists');
      });
    }
    
    return () => {
      document.body.classList.remove('torch-active');
      document.body.classList.add('allow-scroll');
      
      // Retirer les classes spécifiques aux pages
      document.querySelectorAll('.page-content').forEach(el => {
        el.classList.remove('page-content', 'page-book', 'page-contact', 'page-what-we-do', 'page-artists');
      });
    };
  }, [isTorchActive]);

  // Optimiser le contexte avec useMemo pour réduire les recréations
  const contextValue = useMemo(() => ({
    isTorchActive,
    setIsTorchActive,
    mousePosition,
    updateMousePosition,
    containerRef,
    isFingerDown,
    setIsFingerDown,
    scrollPosition
  }), [isTorchActive, mousePosition, updateMousePosition, isFingerDown, scrollPosition]);

  return (
    <TorchContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-visible"
        style={{ position: "relative", zIndex: 0 }}
      >
        {children}
      </div>

      {/* Afficher l'overlay de la torche normale seulement en mode normal */}
      <FlashlightOverlay 
        isTorchActive={isTorchActive}
        uvMode={uvMode}
        mousePosition={mousePosition}
      />
  
      {/* Toujours montrer l'icône de la lampe torche quand elle est active */}
      {isTorchActive && (
        <FlashlightIcon
          isTorchActive={isTorchActive}
          mousePosition={mousePosition}
          uvMode={uvMode}
          isFingerDown={isFingerDown}
        />
      )}
    </TorchContext.Provider>
  );
};

// Re-export hook
export { useIlluminated } from "./useElementIllumination";
