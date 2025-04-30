
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
    
    // Éviter les déclenchements trop fréquents (minimum 2 secondes entre transitions)
    if (transitionInProgressRef.current || (now - lastTransitionTimeRef.current < 2000)) {
      console.log("Transition déjà en cours ou trop récente, ignorée");
      return;
    }
    
    console.log("➡️ Déclenchement transition vidéo");
    transitionInProgressRef.current = true;
    lastTransitionTimeRef.current = now;
    setIsTransitioning(true);
    
    // Nettoyer tout timeout existant
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    
    // Notifier tous les écouteurs - ordre séquentiel
    Promise.all(listenersRef.current.map(async (listener) => {
      try {
        await Promise.resolve(listener());
      } catch (error) {
        console.error('Erreur dans l\'écouteur de transition:', error);
      }
    })).then(() => {
      console.log("Tous les écouteurs de transition ont été appelés");
    });
    
    // Réinitialiser l'état de transition après la durée complète de la vidéo
    transitionTimeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      transitionInProgressRef.current = false;
      console.log("✅ État de transition réinitialisé");
    }, 3000); // Légèrement plus long que la vidéo
  }, []);

  const registerVideoTransitionListener = useCallback((callback: () => void) => {
    listenersRef.current.push(callback);
    console.log("📝 Nouvel écouteur de transition vidéo enregistré");
    
    // Fonction de désinscription
    return () => {
      listenersRef.current = listenersRef.current.filter(listener => listener !== callback);
      console.log("🗑️ Écouteur de transition vidéo désenregistré");
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
    throw new Error('useNavigation doit être utilisé à l\'intérieur d\'un NavigationProvider');
  }
  return context;
};
