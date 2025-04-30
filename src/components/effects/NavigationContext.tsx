
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

  // Utiliser une référence pour les listeners au lieu d'un état pour éviter les re-rendus
  const triggerVideoTransition = useCallback(() => {
    // Éviter les déclenchements multiples rapprochés
    if (transitionInProgressRef.current) {
      console.log('Transition déjà en cours, ignorée');
      return;
    }
    
    console.log('Navigation event triggered, notifying listeners');
    transitionInProgressRef.current = true;
    setIsTransitioning(true);
    
    // Nettoyer tout timeout existant
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    
    // Notifier tous les écouteurs en utilisant la référence
    listenersRef.current.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in transition listener:', error);
      }
    });
    
    // Réinitialiser l'état de transition après un délai
    transitionTimeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      transitionInProgressRef.current = false;
      transitionTimeoutRef.current = null;
    }, 1000);
  }, []);

  const registerVideoTransitionListener = useCallback((callback: () => void) => {
    console.log('New video transition listener registered');
    listenersRef.current.push(callback);
    
    // Return unsubscribe function
    return () => {
      console.log('Video transition listener unregistered');
      listenersRef.current = listenersRef.current.filter(listener => listener !== callback);
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
