
import React, { createContext, useContext, useState, useCallback } from 'react';

interface NavigationContextType {
  triggerVideoTransition: () => void;
  registerVideoTransitionListener: (callback: () => void) => () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listeners, setListeners] = useState<(() => void)[]>([]);

  const triggerVideoTransition = useCallback(() => {
    console.log('Navigation event triggered, notifying listeners');
    listeners.forEach(listener => listener());
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
