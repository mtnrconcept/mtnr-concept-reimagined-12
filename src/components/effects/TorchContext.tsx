
import React, { createContext, useContext, useState, useRef, useEffect } from "react";

// Interface pour le contexte
interface TorchContextType {
  isTorchActive: boolean;
  setIsTorchActive: (active: boolean) => void;
  mousePosition: { x: number; y: number };
  updateMousePosition: (position: { x: number; y: number }) => void;
  elementsToIlluminate: HTMLElement[];
  registerElementForIllumination: (element: HTMLElement) => void;
  unregisterElementForIllumination: (element: HTMLElement) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

// Création du contexte avec des valeurs par défaut
const TorchContext = createContext<TorchContextType>({
  isTorchActive: false,
  setIsTorchActive: () => {},
  mousePosition: { x: 0, y: 0 },
  updateMousePosition: () => {},
  elementsToIlluminate: [],
  registerElementForIllumination: () => {},
  unregisterElementForIllumination: () => {},
  containerRef: { current: null },
});

// Hook personnalisé pour utiliser le contexte
export const useTorchContext = () => useContext(TorchContext);

interface TorchProviderProps {
  children: React.ReactNode;
}

// Fournisseur du contexte
export const TorchProvider: React.FC<TorchProviderProps> = ({ children }) => {
  const [isTorchActive, setIsTorchActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [elementsToIlluminate, setElementsToIlluminate] = useState<HTMLElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mise à jour de la position de la souris
  const updateMousePosition = (position: { x: number; y: number }) => {
    setMousePosition(position);
  };

  // Enregistrement d'un élément à éclairer
  const registerElementForIllumination = (element: HTMLElement) => {
    setElementsToIlluminate(prev => {
      if (prev.includes(element)) return prev;
      return [...prev, element];
    });
  };

  // Désenregistrement d'un élément
  const unregisterElementForIllumination = (element: HTMLElement) => {
    setElementsToIlluminate(prev => prev.filter(el => el !== element));
  };

  // Suivi du mouvement de la souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isTorchActive) {
        updateMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isTorchActive]);

  // Valeurs du contexte
  const contextValue = {
    isTorchActive,
    setIsTorchActive,
    mousePosition,
    updateMousePosition,
    elementsToIlluminate,
    registerElementForIllumination,
    unregisterElementForIllumination,
    containerRef,
  };

  return (
    <TorchContext.Provider value={contextValue}>
      <div ref={containerRef} className="torch-container relative">
        {children}
        {isTorchActive && (
          <div
            id="torch-light"
            className="absolute pointer-events-none z-[9990]"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,221,0,0.4) 0%, transparent 70%)",
              transform: "translate(-50%, -50%)",
              mixBlendMode: "screen",
            }}
          />
        )}
      </div>
    </TorchContext.Provider>
  );
};

// Composant pour activer/désactiver la lampe torche
export const TorchToggle: React.FC = () => {
  const { isTorchActive, setIsTorchActive } = useTorchContext();

  return (
    <button
      className={`fixed bottom-4 right-4 z-50 p-3 rounded-full ${
        isTorchActive ? "bg-yellow-400 text-black" : "bg-gray-800 text-yellow-400"
      } shadow-lg hover:scale-105 transition-all`}
      onClick={() => setIsTorchActive(!isTorchActive)}
      aria-label="Toggle flashlight"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 20h6"></path>
        <path d="M12 20v-8"></path>
        <path d="M5 12h14l-4-8H9z"></path>
      </svg>
    </button>
  );
};
