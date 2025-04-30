
import React, { useState, useEffect, useContext, createContext } from 'react';
import { useVideoStore } from './BackgroundVideoManager';

// Torch Mode Types
export type TorchMode = 'off' | 'normal' | 'uv';

// Context type definition
type TorchContextType = {
  torchMode: TorchMode;
  torchPosition: { x: number; y: number };
  toggleTorch: (mode?: TorchMode) => void;
  setTorchPosition: (position: { x: number; y: number }) => void;
};

// Create the context with default values
const TorchContext = createContext<TorchContextType>({
  torchMode: 'off',
  torchPosition: { x: 0, y: 0 },
  toggleTorch: () => {},
  setTorchPosition: () => {}
});

export const useTorch = () => useContext(TorchContext);

interface TorchProviderProps {
  children: React.ReactNode;
}

export const TorchProvider: React.FC<TorchProviderProps> = ({ children }) => {
  // Torch state
  const [torchMode, setTorchMode] = useState<TorchMode>('off');
  const [torchPosition, setTorchPosition] = useState({ x: 0, y: 0 });
  
  // Get control of the video backgrounds
  const { setActiveVideo } = useVideoStore();

  // Toggle torch mode
  const toggleTorch = (mode?: TorchMode) => {
    if (mode) {
      setTorchMode(mode);
    } else {
      // Cycle through modes: off -> normal -> uv -> off
      setTorchMode(current => {
        if (current === 'off') return 'normal';
        if (current === 'normal') return 'uv';
        return 'off';
      });
    }
  };

  // Effect to update video based on torch mode
  useEffect(() => {
    if (torchMode === 'uv') {
      setActiveVideo('uv');
    } else {
      setActiveVideo('normal');
    }
  }, [torchMode, setActiveVideo]);

  // Mouse movement handler to update torch position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (torchMode !== 'off') {
        setTorchPosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [torchMode]);

  const value = {
    torchMode,
    torchPosition,
    toggleTorch,
    setTorchPosition,
  };

  return (
    <TorchContext.Provider value={value}>
      {children}
      {torchMode !== 'off' && <TorchEffect />}
    </TorchContext.Provider>
  );
};

const TorchEffect: React.FC = () => {
  const { torchMode, torchPosition } = useTorch();
  
  // If the torch is off, don't render anything
  if (torchMode === 'off') return null;
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        maskImage: `radial-gradient(circle 300px at ${torchPosition.x}px ${torchPosition.y}px, transparent 0%, black 100%)`,
        WebkitMaskImage: `radial-gradient(circle 300px at ${torchPosition.x}px ${torchPosition.y}px, transparent 0%, black 100%)`,
        backgroundColor: torchMode === 'normal' ? 'rgba(0,0,0,0.75)' : 'transparent',
      }}
    >
      {torchMode === 'uv' && (
        <div 
          className="absolute inset-0"
          style={{
            maskImage: `radial-gradient(circle 300px at ${torchPosition.x}px ${torchPosition.y}px, black 0%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 300px at ${torchPosition.x}px ${torchPosition.y}px, black 0%, transparent 100%)`,
          }}
        />
      )}
    </div>
  );
};

// Torch control buttons component
export const TorchControls: React.FC = () => {
  const { torchMode, toggleTorch } = useTorch();
  
  return (
    <div className="fixed bottom-4 right-4 flex space-x-3 z-50">
      <button 
        className={`p-3 rounded-full shadow-lg ${
          torchMode === 'normal' ? 'bg-yellow-500 text-black' : 'bg-black/70 text-yellow-500'
        }`}
        onClick={() => toggleTorch('normal')}
        title="Torch Mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V21M10 3H14L13 9H11L10 3ZM13 9V14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14V9H13Z" />
        </svg>
      </button>
      <button 
        className={`p-3 rounded-full shadow-lg ${
          torchMode === 'uv' ? 'bg-purple-500 text-white' : 'bg-black/70 text-purple-300'
        }`}
        onClick={() => toggleTorch('uv')}
        title="UV Mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V21M10 3H14L13 9H11L10 3ZM13 9V14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14V9H13Z" />
          <path d="M8 6L5 9M16 6L19 9" />
        </svg>
      </button>
    </div>
  );
};
