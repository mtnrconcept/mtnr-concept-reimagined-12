
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Constants for transition timings
const TRANSITION_DURATION = 7000; // 7 seconds total for video transition
const MIN_TRANSITION_INTERVAL = 2000; // Minimum time between transitions

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

  // Auto-trigger on route change
  useEffect(() => {
    // Avoid triggering on initial mount
    if (lastTransitionTimeRef.current === 0) {
      lastTransitionTimeRef.current = Date.now();
      return;
    }
  }, [location.pathname]);

  const triggerVideoTransition = useCallback(() => {
    const now = Date.now();
    
    // Avoid triggering transitions too frequently
    if (transitionInProgressRef.current || (now - lastTransitionTimeRef.current < MIN_TRANSITION_INTERVAL)) {
      console.log("Transition already in progress or too recent, ignoring");
      return;
    }
    
    console.log("➡️ Triggering video transition");
    transitionInProgressRef.current = true;
    lastTransitionTimeRef.current = now;
    setIsTransitioning(true);
    
    // Clear any existing timeout
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    
    // Create a copy of listeners to avoid mutations during iteration
    const currentListeners = [...listenersRef.current];
    
    // Execute all listeners
    Promise.all(currentListeners.map(async (listener) => {
      try {
        await Promise.resolve(listener());
      } catch (error) {
        console.error('Error in transition listener:', error);
      }
    })).then(() => {
      console.log("All transition listeners have been called");
      
      // Reset transition state after transition duration
      transitionTimeoutRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        transitionInProgressRef.current = false;
        console.log("✅ Transition state reset");
      }, TRANSITION_DURATION); // Use our constant for transition duration
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
