
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
    if (transitionInProgressRef.current || lastTransitionTimeRef.current === 0) {
      lastTransitionTimeRef.current = Date.now();
      return;
    }
    
    console.log("Changement d'URL détecté, déclenchement automatique de la transition vidéo");
    triggerVideoTransition();
  }, [location.pathname]);

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
    
    // Créer une copie des écouteurs pour éviter les mutations pendant l'itération
    const currentListeners = [...listenersRef.current];
    
    // Exécuter tous les écouteurs de manière séquentielle
    const executeListeners = async () => {
      try {
        // Exécuter en parallèle plutôt que séquentiellement pour éviter les blocages
        await Promise.all(currentListeners.map(async (listener) => {
          try {
            await Promise.resolve(listener());
          } catch (error) {
            console.error('Erreur dans l\'écouteur de transition:', error);
          }
        }));
        
        console.log("Tous les écouteurs de transition ont été appelés");
      } catch (error) {
        console.error('Erreur lors de l\'exécution des écouteurs:', error);
      }
    };
    
    // Exécuter les écouteurs et réinitialiser l'état de transition après la durée complète
    executeListeners().finally(() => {
      // Prolonger légèrement le délai pour s'assurer que la vidéo a bien le temps de se terminer
      transitionTimeoutRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        transitionInProgressRef.current = false;
        console.log("✅ État de transition réinitialisé");
      }, 7500); // Légèrement plus long que la vidéo pour être sûr
    });
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
