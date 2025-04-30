
import React, { createContext, useContext, useRef } from 'react';

interface TransitionListenerContextType {
  registerVideoTransitionListener: (callback: () => void) => () => void;
  notifyTransitionListeners: () => Promise<void>;
}

const TransitionListenerContext = createContext<TransitionListenerContextType | null>(null);

export const TransitionListenerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const listenersRef = useRef<(() => void)[]>([]);
  
  const registerVideoTransitionListener = React.useCallback((callback: () => void) => {
    listenersRef.current.push(callback);
    console.log("📝 Nouvel écouteur de transition vidéo enregistré");
    
    // Fonction de désinscription
    return () => {
      listenersRef.current = listenersRef.current.filter(listener => listener !== callback);
      console.log("🗑️ Écouteur de transition vidéo désenregistré");
    };
  }, []);

  const notifyTransitionListeners = React.useCallback(async () => {
    // Notifier tous les écouteurs en parallèle
    await Promise.all(listenersRef.current.map(async (listener) => {
      try {
        await Promise.resolve(listener());
      } catch (error) {
        console.error('Erreur dans l\'écouteur de transition:', error);
      }
    }));
    console.log("Tous les écouteurs de transition ont été appelés");
  }, []);

  return (
    <TransitionListenerContext.Provider
      value={{
        registerVideoTransitionListener,
        notifyTransitionListeners
      }}
    >
      {children}
    </TransitionListenerContext.Provider>
  );
};

export const useTransitionListener = () => {
  const context = useContext(TransitionListenerContext);
  if (!context) {
    throw new Error('useTransitionListener doit être utilisé à l\'intérieur d\'un TransitionListenerProvider');
  }
  return context;
};
