
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
  const uvCircleRef = useRef<HTMLDivElement>(null);

  const updateMousePosition = (position: { x: number; y: number }) => {
    setMousePosition(position);
    
    // Mettre à jour la position du cercle UV si actif
    if (uvCircleRef.current && uvMode) {
      uvCircleRef.current.style.left = `${position.x}px`;
      uvCircleRef.current.style.top = `${position.y}px`;
    }
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

  // Créer l'élément de cercle UV lorsque le mode UV est activé
  useEffect(() => {
    if (isTorchActive && uvMode) {
      if (!uvCircleRef.current) {
        const circle = document.createElement('div');
        circle.className = 'uv-light-circle active';
        circle.style.left = `${mousePosition.x}px`;
        circle.style.top = `${mousePosition.y}px`;
        document.body.appendChild(circle);
        uvCircleRef.current = circle;
      }
    } else {
      if (uvCircleRef.current) {
        uvCircleRef.current.remove();
        uvCircleRef.current = null;
      }
    }
    
    return () => {
      if (uvCircleRef.current) {
        uvCircleRef.current.remove();
        uvCircleRef.current = null;
      }
    };
  }, [isTorchActive, uvMode, mousePosition]);

  // Appliquer un effet global sur le document lorsque le mode UV est activé
  useEffect(() => {
    const logos = document.querySelectorAll('img[src*="logo"]');
    const navLinks = document.querySelectorAll('nav a');
    const buttons = document.querySelectorAll('button, a.btn, .btn, [role="button"]');
    
    if (isTorchActive && uvMode) {
      // Ajouter une classe au body pour les styles globaux du mode UV
      document.body.classList.add('uv-mode-active');
      
      // Appliquer des effets aux éléments de navigation
      navLinks.forEach(link => {
        link.classList.add('uv-nav-link');
      });
      
      // Appliquer un effet aux boutons
      buttons.forEach(button => {
        button.classList.add('uv-button');
      });
      
      // Jouer un son subtil si disponible (optionnel)
      try {
        // Créer un son subtil de "click" électronique
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (e) {
        // Ignorer les erreurs si le Web Audio API n'est pas supporté
        console.log("Audio API non supportée", e);
      }
      
    } else {
      document.body.classList.remove('uv-mode-active');
      
      navLinks.forEach(link => {
        link.classList.remove('uv-nav-link');
      });
      
      buttons.forEach(button => {
        button.classList.remove('uv-button');
      });
    }
    
    return () => {
      document.body.classList.remove('uv-mode-active');
      
      navLinks.forEach(link => {
        link.classList.remove('uv-nav-link');
      });
      
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
        // Effet plus prononcé en mode UV avec couleur bleu néon
        el.style.boxShadow = `${offsetX}px ${offsetY}px ${blurRadius}px rgba(0, 170, 255, 0.7)`;
        el.style.transition = "box-shadow 0.3s ease-out";
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
        {isTorchActive && !uvMode && (
          <svg className="fixed top-0 left-0 w-full h-full z-[9999] pointer-events-none">
            <defs>
              <radialGradient id="torch-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="black" stopOpacity="0" />
                <stop offset="70%" stopColor="black" stopOpacity="0.3" />
                <stop offset="100%" stopColor="black" stopOpacity="0.95" />
              </radialGradient>
              <mask id="torch-mask">
                <rect width="100%" height="100%" fill="white" />
                <circle
                  cx={mousePosition.x}
                  cy={mousePosition.y}
                  r={800}
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
