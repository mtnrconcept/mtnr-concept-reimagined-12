
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

interface NavigationContextType {
  triggerVideoTransition: () => void;
  registerVideoTransitionListener: (callback: () => void) => () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Utiliser useRef pour stocker les listeners au lieu de useState
  // afin d'éviter les rendus infinis
  const listenersRef = useRef<(() => void)[]>([]);

  const triggerVideoTransition = useCallback(() => {
    console.log('Navigation event triggered, notifying listeners');
    listenersRef.current.forEach(listener => listener());
  }, []);

  const registerVideoTransitionListener = useCallback((callback: () => void) => {
    listenersRef.current.push(callback);
    
    // Return unsubscribe function
    return () => {
      listenersRef.current = listenersRef.current.filter(listener => listener !== callback);
    };
  }, []);

  return (
    <NavigationContext.Provider 
      value={{ 
        triggerVideoTransition, 
        registerVideoTransitionListener 
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
