
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TorchToggle } from './TorchToggle';
import { useVideoStore } from './BackgroundVideoManager';

// Contexte de la torche
interface TorchContextType {
  isTorchActive: boolean;
  setIsTorchActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const TorchContext = createContext<TorchContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte de la torche
export const useTorch = (): TorchContextType => {
  const context = useContext(TorchContext);
  if (!context) {
    throw new Error('useTorch doit être utilisé dans un TorchProvider');
  }
  return context;
};

// Provider pour le contexte de la torche
interface TorchProviderProps {
  children: React.ReactNode;
}

export const TorchProvider: React.FC<TorchProviderProps> = ({ children }) => {
  const [isTorchActive, setIsTorchActive] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { play, currentMode } = useVideoStore(state => ({
    play: state.play,
    currentMode: state.currentMode
  }));

  // Effet pour suivre la position de la souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (isTorchActive) {
      window.addEventListener('mousemove', handleMouseMove);
      document.documentElement.classList.add('torch-active');
      
      // Si en mode UV, jouer la vidéo UV
      if (currentMode === 'uv' && play) {
        play();
      }
    } else {
      document.documentElement.classList.remove('torch-active');
      document.documentElement.classList.remove('uv-mode');
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTorchActive, play, currentMode]);

  // Applique l'effet de torche avec la position de la souris
  useEffect(() => {
    if (isTorchActive) {
      document.documentElement.style.setProperty('--torch-x', `${mousePos.x}px`);
      document.documentElement.style.setProperty('--torch-y', `${mousePos.y}px`);
    }
  }, [mousePos, isTorchActive]);

  return (
    <TorchContext.Provider value={{ isTorchActive, setIsTorchActive }}>
      {children}
      
      {/* Masque de la torche */}
      {isTorchActive && (
        <div 
          className="fixed inset-0 pointer-events-none z-40 torch-mask" 
          style={{
            background: `radial-gradient(circle 300px at var(--torch-x, 50%) var(--torch-y, 50%), 
              transparent, rgba(0, 0, 0, 0.85))`,
          }}
        />
      )}
    </TorchContext.Provider>
  );
};

// Composant de contrôle de la torche
export const TorchControls = () => {
  return <TorchToggle />;
};
