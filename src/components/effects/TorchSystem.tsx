
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Flashlight } from 'lucide-react';
import { useVideoStore } from './BackgroundVideoManager';

// Define the torch context type
type TorchContextType = {
  isActive: boolean;
  mode: 'normal' | 'uv';
  toggleTorch: () => void;
  toggleMode: () => void;
  position: { x: number, y: number };
};

// Create context with default values
const TorchContext = createContext<TorchContextType>({
  isActive: false,
  mode: 'normal',
  toggleTorch: () => {},
  toggleMode: () => {},
  position: { x: 0, y: 0 },
});

// Hook to use the torch context
export const useTorch = () => useContext(TorchContext);

// Provider component
export const TorchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'normal' | 'uv'>('normal');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Access the video store to control background videos
  const videoStore = useVideoStore();

  // Toggle torch on/off
  const toggleTorch = () => setIsActive(prev => !prev);

  // Toggle between normal and UV modes
  const toggleMode = () => {
    const newMode = mode === 'normal' ? 'uv' : 'normal';
    setMode(newMode);
    // Update video mode using the setMode function
    videoStore.setMode(newMode);
  };

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isActive) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isActive]);

  // Update body class based on active mode
  useEffect(() => {
    if (mode === 'uv') {
      document.body.classList.add('uv-mode-active');
    } else {
      document.body.classList.remove('uv-mode-active');
    }
  }, [mode]);

  return (
    <TorchContext.Provider value={{ isActive, mode, toggleTorch, toggleMode, position }}>
      {children}
    </TorchContext.Provider>
  );
};

// The torch effect overlay component
export const TorchEffect: React.FC = () => {
  const { isActive, mode, position } = useTorch();
  
  if (!isActive) return null;
  
  const torchRadius = 300; // px
  
  return (
    <div className={`torch-effect ${mode}`}>
      <div 
        className="torch-mask"
        style={{
          background: mode === 'normal' 
            ? `radial-gradient(circle ${torchRadius}px at ${position.x}px ${position.y}px, transparent 0%, rgba(0, 0, 0, 0.75) 100%)`
            : `radial-gradient(circle ${torchRadius}px at ${position.x}px ${position.y}px, transparent 0%, rgba(0, 0, 0, 0.95) 100%)`
        }}
      />
    </div>
  );
};

// Control buttons for the torch
export const TorchControls: React.FC = () => {
  const { isActive, mode, toggleTorch, toggleMode } = useTorch();
  
  return (
    <div className="torch-buttons">
      <button 
        className={`torch-button torch-button-normal ${isActive && mode === 'normal' ? 'active' : ''}`}
        onClick={toggleTorch}
        title="Toggle Torch"
      >
        <Flashlight size={20} />
      </button>
      
      {isActive && (
        <button 
          className={`torch-button torch-button-uv ${mode === 'uv' ? 'active' : ''}`}
          onClick={toggleMode}
          title="Toggle UV Mode"
        >
          <Flashlight size={20} />
        </button>
      )}
    </div>
  );
};
