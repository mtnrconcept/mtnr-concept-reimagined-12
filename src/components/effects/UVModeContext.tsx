
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
  const videoStore = useVideoStore();

  // Fonction pour basculer le mode UV
  const toggleUVMode = () => {
    setUVMode(prev => !prev);
  };

  // Effet pour appliquer les changements CSS au document
  useEffect(() => {
    if (uvMode) {
      document.documentElement.classList.add('uv-mode');
      // Si le store vidéo est disponible et que le mode UV est activé, jouer la vidéo UV
      if (videoStore && videoStore.play) {
        videoStore.setMode('uv');
        videoStore.play();
      }
    } else {
      document.documentElement.classList.remove('uv-mode');
      // Si le store vidéo est disponible et que le mode UV est désactivé, revenir à la vidéo normale
      if (videoStore && videoStore.play) {
        videoStore.setMode('normal');
      }
    }
  }, [uvMode, videoStore]);

  return (
    <UVModeContext.Provider value={{ uvMode, toggleUVMode }}>
      {children}
    </UVModeContext.Provider>
  );
};

// Ajout du composant de base
export const UVModeContextProvider: React.FC<UVModeProviderProps> = ({ children }) => {
  return (
    <UVModeProvider>
      {children}
    </UVModeProvider>
  );
};
