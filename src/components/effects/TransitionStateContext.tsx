
import React, { createContext, useContext, useState, useRef } from 'react';

interface TransitionStateContextType {
  isTransitioning: boolean;
  setTransitionState: (isActive: boolean) => void;
  transitionInProgress: boolean;
  lastTransitionTime: number;
}

const TransitionStateContext = createContext<TransitionStateContextType | null>(null);

export const TransitionStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionInProgressRef = useRef<boolean>(false);
  const lastTransitionTimeRef = useRef<number>(0);
  const transitionTimeoutRef = useRef<number | null>(null);
  
  const setTransitionState = React.useCallback((isActive: boolean) => {
    setIsTransitioning(isActive);
    transitionInProgressRef.current = isActive;
    
    if (isActive) {
      lastTransitionTimeRef.current = Date.now();
      
      // Nettoyer tout timeout existant
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      
      // Réinitialiser l'état de transition après la durée complète de la vidéo
      transitionTimeoutRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        transitionInProgressRef.current = false;
        console.log("✅ État de transition réinitialisé");
      }, 3000); // Légèrement plus long que la vidéo
    }
  }, []);

  return (
    <TransitionStateContext.Provider
      value={{
        isTransitioning,
        setTransitionState,
        transitionInProgress: transitionInProgressRef.current,
        lastTransitionTime: lastTransitionTimeRef.current
      }}
    >
      {children}
    </TransitionStateContext.Provider>
  );
};

export const useTransitionState = () => {
  const context = useContext(TransitionStateContext);
  if (!context) {
    throw new Error('useTransitionState doit être utilisé à l\'intérieur d\'un TransitionStateProvider');
  }
  return context;
};
