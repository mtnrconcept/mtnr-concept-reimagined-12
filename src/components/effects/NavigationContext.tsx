
import React, { createContext, useContext, useState } from 'react';

interface NavigationContextType {
  triggerVideoTransition: () => void;
  registerVideoTransitionListener: (callback: () => void) => () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listeners, setListeners] = useState<(() => void)[]>([]);

  const triggerVideoTransition = () => {
    console.log('Navigation event triggered, notifying listeners');
    listeners.forEach(listener => listener());
  };

  const registerVideoTransitionListener = (callback: () => void) => {
    setListeners(prev => [...prev, callback]);
    
    // Return unsubscribe function
    return () => {
      setListeners(prev => prev.filter(listener => listener !== callback));
    };
  };

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
