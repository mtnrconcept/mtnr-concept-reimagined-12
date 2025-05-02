
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface NavigationContextType {
  triggerVideoTransition: () => void;
  registerVideoTransitionListener: (callback: () => void) => () => void;
  isTransitioning: boolean;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const listenersRef = useRef<(() => void)[]>([]);
  const transitionTimeoutRef = useRef<number | null>(null);
  const transitionInProgressRef = useRef<boolean>(false);

  const triggerVideoTransition = useCallback(() => {
    // Éviter les déclenchements multiples rapprochés
    if (transitionInProgressRef.current) {
      console.log("Transition déjà en cours, ignorée");
      return;
    }
    
    console.log("Déclenchement transition vidéo");
    transitionInProgressRef.current = true;
    setIsTransitioning(true);
    
    // Nettoyer tout timeout existant
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    
    // Notifier tous les écouteurs
    listenersRef.current.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in transition listener:', error);
      }
    });
    
    // Réinitialiser l'état de transition après un délai plus long
    // pour permettre à la vidéo de commencer sa lecture
    transitionTimeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      transitionInProgressRef.current = false;
      console.log("État de transition réinitialisé");
    }, 1000); // Temps suffisant pour laisser la vidéo commencer
  }, []);

  const registerVideoTransitionListener = useCallback((callback: () => void) => {
    listenersRef.current.push(callback);
    console.log("Écouteur de transition vidéo enregistré");
    
    // Return unsubscribe function
    return () => {
      listenersRef.current = listenersRef.current.filter(listener => listener !== callback);
      console.log("Écouteur de transition vidéo désenregistré");
    };
  }, []);

  return (
    <NavigationContext.Provider 
      value={{ 
        triggerVideoTransition, 
        registerVideoTransitionListener,
        isTransitioning
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
