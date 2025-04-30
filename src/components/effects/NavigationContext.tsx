
import React, { createContext, useContext, useCallback } from 'react';
import { VideoRefProvider, useVideoRef } from './VideoRefContext';
import { TransitionListenerProvider, useTransitionListener } from './TransitionListenerContext';
import { TransitionStateProvider, useTransitionState } from './TransitionStateContext';

interface NavigationContextType {
  triggerVideoTransition: () => void;
  registerVideoTransitionListener: (callback: () => void) => () => void;
  registerVideoRef: (ref: React.RefObject<HTMLVideoElement>, isUVVideo?: boolean) => void;
  isTransitioning: boolean;
  normalVideoRef: React.RefObject<HTMLVideoElement>;
  uvVideoRef: React.RefObject<HTMLVideoElement>;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

// Internal component to access all providers
const NavigationContextInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { registerVideoRef, normalVideoRef, uvVideoRef } = useVideoRef();
  const { registerVideoTransitionListener, notifyTransitionListeners } = useTransitionListener();
  const { isTransitioning, setTransitionState, transitionInProgress, lastTransitionTime } = useTransitionState();
  
  const triggerVideoTransition = useCallback(async () => {
    const now = Date.now();
    
    // Éviter les déclenchements trop fréquents (minimum 2 secondes entre transitions)
    if (transitionInProgress || (now - lastTransitionTime < 2000)) {
      console.log("Transition déjà en cours ou trop récente, ignorée");
      return;
    }
    
    console.log("➡️ Déclenchement transition vidéo");
    setTransitionState(true);
    
    // Contrôle direct de la vidéo - méthode plus fiable
    try {
      // Utiliser la référence vidéo appropriée
      const videoElement = normalVideoRef.current;
      
      if (videoElement) {
        console.log("Contrôle direct de la vidéo pour transition");
        
        // Réinitialiser la vidéo et s'assurer qu'elle est correctement configurée
        videoElement.currentTime = 0;
        videoElement.muted = true;
        videoElement.playsInline = true;
        videoElement.setAttribute("playsinline", "");
        videoElement.setAttribute("webkit-playsinline", "");
        videoElement.classList.add("video-transitioning");
        
        try {
          await videoElement.play();
          console.log("✅ Vidéo démarrée avec succès via contrôle direct");
        } catch (error) {
          console.error("❌ Erreur lors du démarrage direct de la vidéo:", error);
          console.error("Source de la vidéo:", videoElement.currentSrc);
          
          // Tentative supplémentaire de récupération
          setTimeout(async () => {
            try {
              videoElement.load();
              await videoElement.play();
              console.log("✅ Vidéo démarrée avec succès après délai");
            } catch (retryError) {
              console.error("❌❌ Deuxième échec de lecture vidéo:", retryError);
            }
          }, 100);
        }
      } else {
        console.warn("❗ Référence vidéo non disponible pour contrôle direct");
      }
    } catch (outerError) {
      console.error("Erreur générale lors de la tentative de lecture:", outerError);
    }
    
    // Notifier tous les écouteurs
    await notifyTransitionListeners();
  }, [normalVideoRef, notifyTransitionListeners, lastTransitionTime, transitionInProgress, setTransitionState]);

  return (
    <NavigationContext.Provider 
      value={{ 
        triggerVideoTransition, 
        registerVideoTransitionListener,
        registerVideoRef,
        isTransitioning,
        normalVideoRef,
        uvVideoRef
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <VideoRefProvider>
      <TransitionListenerProvider>
        <TransitionStateProvider>
          <NavigationContextInner>{children}</NavigationContextInner>
        </TransitionStateProvider>
      </TransitionListenerProvider>
    </VideoRefProvider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation doit être utilisé à l\'intérieur d\'un NavigationProvider');
  }
  return context;
};
