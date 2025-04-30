
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
  const lastTransitionTimeRef = useRef<number>(0);

  const triggerVideoTransition = useCallback(() => {
    const now = Date.now();
    
    // Ne déclencher la transition que si au moins 2 secondes se sont écoulées depuis la dernière
    if (transitionInProgressRef.current || (now - lastTransitionTimeRef.current < 2000)) {
      console.log("Transition déjà en cours ou trop récente, ignorée");
      return;
    }
    
    console.log("Déclenchement transition vidéo");
    transitionInProgressRef.current = true;
    lastTransitionTimeRef.current = now;
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
        console.error('Erreur dans l\'écouteur de transition:', error);
      }
    });
    
    // Réinitialiser l'état de transition après la durée de la vidéo
    // Durée de transition légèrement plus longue pour éviter les chevauchements
    transitionTimeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      transitionInProgressRef.current = false;
      console.log("État de transition réinitialisé");
    }, 3000); // Durée légèrement plus longue que la vidéo pour assurer la fin complète
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
