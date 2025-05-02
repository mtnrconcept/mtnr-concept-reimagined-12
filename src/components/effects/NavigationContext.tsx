
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
  const lastTransitionTimeRef = useRef<number>(0);
  const location = useLocation();

  // Déclencher automatiquement à chaque changement de route
  useEffect(() => {
    // On évite de déclencher lors du montage initial
    if (lastTransitionTimeRef.current === 0) {
      lastTransitionTimeRef.current = Date.now();
      return;
    }
  }, [location.pathname]);

  const triggerVideoTransition = useCallback(() => {
    const now = Date.now();
    
    // Éviter les déclenchements trop fréquents (minimum 2 secondes entre transitions)
    if (transitionInProgressRef.current || (now - lastTransitionTimeRef.current < 2000)) {
      console.log("Transition already in progress or too recent, ignoring");
      return;
    }
    
    console.log("➡️ Triggering video transition");
    transitionInProgressRef.current = true;
    lastTransitionTimeRef.current = now;
    setIsTransitioning(true);
    
    // Nettoyer tout timeout existant
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    
    // Créer une copie des écouteurs pour éviter les mutations pendant l'itération
    const currentListeners = [...listenersRef.current];
    
    // Exécuter tous les écouteurs
    Promise.all(currentListeners.map(async (listener) => {
      try {
        await Promise.resolve(listener());
      } catch (error) {
        console.error('Error in transition listener:', error);
      }
    })).then(() => {
      console.log("All transition listeners have been called");
      
      // Reset transition state after video duration
      transitionTimeoutRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        transitionInProgressRef.current = false;
        console.log("✅ Transition state reset");
      }, 7000); // Video duration
    });
  }, []);

  const registerVideoTransitionListener = useCallback((callback: () => void) => {
    listenersRef.current.push(callback);
    console.log("📝 New video transition listener registered");
    
    // Unregister function
    return () => {
      listenersRef.current = listenersRef.current.filter(listener => listener !== callback);
      console.log("🗑️ Video transition listener unregistered");
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
