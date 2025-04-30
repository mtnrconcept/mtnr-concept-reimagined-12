
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface NavigationContextType {
  triggerVideoTransition: () => void;
  registerVideoTransitionListener: (callback: () => void) => () => void;
  registerVideoRef: (ref: React.RefObject<HTMLVideoElement>, isUVVideo?: boolean) => void;
  isTransitioning: boolean;
  normalVideoRef: React.RefObject<HTMLVideoElement>;
  uvVideoRef: React.RefObject<HTMLVideoElement>;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const listenersRef = useRef<(() => void)[]>([]);
  const transitionTimeoutRef = useRef<number | null>(null);
  const transitionInProgressRef = useRef<boolean>(false);
  const lastTransitionTimeRef = useRef<number>(0);
  const normalVideoRef = useRef<HTMLVideoElement>(null);
  const uvVideoRef = useRef<HTMLVideoElement>(null);

  const registerVideoRef = useCallback((ref: React.RefObject<HTMLVideoElement>, isUVVideo = false) => {
    if (isUVVideo) {
      uvVideoRef.current = ref.current;
    } else {
      normalVideoRef.current = ref.current;
    }
    console.log(`Référence vidéo ${isUVVideo ? 'UV' : 'normale'} enregistrée`);
  }, []);

  const triggerVideoTransition = useCallback(async () => {
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
    
    // Contrôle direct de la vidéo - méthode plus fiable
    try {
      const videoElement = normalVideoRef.current;
      if (videoElement && document.body.contains(videoElement)) {
        console.log("Contrôle direct de la vidéo pour transition");
        videoElement.currentTime = 0;
        videoElement.classList.add("video-transitioning");
        
        try {
          await videoElement.play();
          console.log("✅ Vidéo démarrée avec succès via contrôle direct");
        } catch (error) {
          console.error("❌ Erreur lors du démarrage direct de la vidéo:", error);
          
          // Tentative de récupération avec attributs forcés
          videoElement.muted = true;
          videoElement.playsInline = true;
          videoElement.setAttribute("playsinline", "");
          
          try {
            await videoElement.play();
            console.log("✅ Vidéo démarrée avec succès après récupération");
          } catch (fallbackError) {
            console.error("❌❌ Échec de la récupération:", fallbackError);
          }
        }
      } else {
        console.warn("Référence vidéo non disponible, utilisation des écouteurs");
      }
    } catch (outerError) {
      console.error("Erreur générale lors de la tentative de lecture:", outerError);
    }
    
    // Notifier tous les écouteurs en parallèle
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

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation doit être utilisé à l\'intérieur d\'un NavigationProvider');
  }
  return context;
};
