
import React, { createContext, useContext, useState } from "react";
import { useUVCircle } from "@/hooks/useUVCircle";
import { useUVModeEffects } from "@/hooks/useUVModeEffects";

interface UVModeContextType {
  uvMode: boolean;
  toggleUVMode: () => void;
  uvCircleRef: React.RefObject<HTMLDivElement>;
  createUVCircle: (mousePosition: { x: number; y: number }) => void;
  removeUVCircle: () => void;
}

const UVModeContext = createContext<UVModeContextType>({
  uvMode: false,
  toggleUVMode: () => {},
  uvCircleRef: { current: null },
  createUVCircle: () => {},
  removeUVCircle: () => {},
});

export const useUVMode = () => useContext(UVModeContext);

export const UVModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uvMode, setUVMode] = useState(false);
  const { uvCircleRef, createUVCircle, removeUVCircle } = useUVCircle();
  
  const toggleUVMode = () => {
    setUVMode(prev => !prev);
  };

  // Apply UV mode side effects
  useUVModeEffects(uvMode);

  return (
    <UVModeContext.Provider value={{ 
      uvMode, 
      toggleUVMode,
      uvCircleRef,
      createUVCircle,
      removeUVCircle
    }}>
      {children}
    </UVModeContext.Provider>
  );
};
