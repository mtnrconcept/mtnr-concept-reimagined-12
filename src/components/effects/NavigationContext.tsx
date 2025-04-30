
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface NavigationContextType {
  triggerVideoTransition: () => void;
  registerVideoTransitionListener: (callback: () => void) => () => void;
  isTransitioning: boolean;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listeners, setListeners] = useState<(() => void)[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);

  const triggerVideoTransition = useCallback(() => {
    console.log('Navigation event triggered, notifying listeners');
    setIsTransitioning(true);
    
    // Éviter les déclenchements multiples rapprochés
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    
    // Notifier tous les écouteurs
    listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in transition listener:', error);
      }
    });
    
    // Réinitialiser l'état de transition après un délai
    transitionTimeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      transitionTimeoutRef.current = null;
    }, 1000);
  }, [listeners]);

  const registerVideoTransitionListener = useCallback((callback: () => void) => {
    console.log('New video transition listener registered');
    setListeners(prev => [...prev, callback]);
    
    // Return unsubscribe function
    return () => {
      setListeners(prev => prev.filter(listener => listener !== callback));
      console.log('Video transition listener unregistered');
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
