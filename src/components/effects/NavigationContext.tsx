
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

interface NavigationContextType {
  triggerVideoTransition: () => void;
  registerVideoTransitionListener: (callback: () => void) => () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Utiliser un ref pour stocker les listeners au lieu d'un state
  // Cela évite des re-renders inutiles et des problèmes de profondeur de mise à jour
  const listenersRef = useRef<(() => void)[]>([]);
  
  // Ref pour éviter les déclenchements multiples
  const transitionInProgressRef = useRef<boolean>(false);

  const triggerVideoTransition = useCallback(() => {
    // Éviter les déclenchements multiples rapprochés
    if (transitionInProgressRef.current) return;
    
    transitionInProgressRef.current = true;
    console.log('Navigation event triggered, notifying listeners');
    
    // Notifier tous les listeners enregistrés
    listenersRef.current.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Erreur lors de l\'exécution d\'un listener de navigation:', error);
      }
    });
    
    // Réinitialiser après un court délai pour permettre d'autres transitions
    setTimeout(() => {
      transitionInProgressRef.current = false;
    }, 500);
  }, []);

  const registerVideoTransitionListener = useCallback((callback: () => void) => {
    // Ajouter le listener à la liste
    listenersRef.current.push(callback);
    console.log(`Nouveau listener enregistré, total: ${listenersRef.current.length}`);
    
    // Retourner une fonction pour se désabonner
    return () => {
      listenersRef.current = listenersRef.current.filter(listener => listener !== callback);
      console.log(`Listener désenregistré, total: ${listenersRef.current.length}`);
    };
  }, []);

  // Créer un objet context stable avec useCallback pour éviter les re-renders inutiles
  const contextValue = React.useMemo(() => ({
    triggerVideoTransition,
    registerVideoTransitionListener
  }), [triggerVideoTransition, registerVideoTransitionListener]);

  return (
    <NavigationContext.Provider value={contextValue}>
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
