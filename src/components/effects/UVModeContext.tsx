
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useVideoStore } from './BackgroundVideoManager';

// Type pour le contexte du mode UV
interface UVModeContextType {
  uvMode: boolean;
  toggleUVMode: () => void;
}

// Création du contexte
const UVModeContext = createContext<UVModeContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useUVMode = (): UVModeContextType => {
  const context = useContext(UVModeContext);
  if (!context) {
    throw new Error('useUVMode doit être utilisé dans un UVModeProvider');
  }
  return context;
};

// Provider pour le contexte UV
interface UVModeProviderProps {
  children: React.ReactNode;
}

export const UVModeProvider: React.FC<UVModeProviderProps> = ({ children }) => {
  const [uvMode, setUVMode] = useState<boolean>(false);
  const { play } = useVideoStore(state => ({ play: state.play }));

  // Fonction pour basculer le mode UV
  const toggleUVMode = () => {
    setUVMode(prev => !prev);
  };

  // Effet pour appliquer les changements CSS au document et jouer la vidéo
  useEffect(() => {
    if (uvMode) {
      document.documentElement.classList.add('uv-mode');
      // Jouer la vidéo seulement si elle est définie
      if (play) {
        play();
      }
    } else {
      document.documentElement.classList.remove('uv-mode');
    }
  }, [uvMode, play]);

  return (
    <UVModeContext.Provider value={{ uvMode, toggleUVMode }}>
      {children}
    </UVModeContext.Provider>
  );
};

// Composant de base pour fournir le contexte UV
export const UVModeContextProvider: React.FC<UVModeProviderProps> = ({ children }) => {
  return (
    <UVModeProvider>
      {children}
    </UVModeProvider>
  );
};
