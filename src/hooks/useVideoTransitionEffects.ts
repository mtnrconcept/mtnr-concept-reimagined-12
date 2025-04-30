
import { useEffect, useCallback, useRef } from 'react';
import { useNavigation } from '@/components/effects/NavigationContext';

interface UseVideoTransitionEffectsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isFirstLoad: boolean;
  setIsFirstLoad: (value: boolean) => void;
  isTransitioning: boolean;
  hasUserInteraction: boolean;
  currentVideo: string;
  playVideoTransition: () => Promise<void>;
  handleUserInteraction: () => void;
  uvMode: boolean;
  isTorchActive: boolean | undefined;
}

export const useVideoTransitionEffects = ({
  videoRef,
  isFirstLoad,
  setIsFirstLoad,
  isTransitioning,
  hasUserInteraction,
  currentVideo,
  playVideoTransition,
  handleUserInteraction,
  uvMode,
  isTorchActive
}: UseVideoTransitionEffectsProps) => {
  const navigation = useNavigation();
  const transitionPendingRef = useRef(false);
  const initialSetupCompleteRef = useRef(false);

  // Fonction qui exécute la transition si les conditions sont réunies
  const executeTransition = useCallback(() => {
    if (transitionPendingRef.current) return;
    
    transitionPendingRef.current = true;
    
    if (hasUserInteraction && !isTransitioning) {
      console.log("Démarrage de la transition vidéo suite à un événement de navigation");
      playVideoTransition().finally(() => {
        transitionPendingRef.current = false;
      });
    } else if (!hasUserInteraction) {
      console.log("Interaction utilisateur requise pour jouer la vidéo - mémorisation de l'action");
      // Simuler une interaction utilisateur pour permettre la lecture automatique
      handleUserInteraction();
      // Planifier la transition après un court délai
      setTimeout(() => {
        playVideoTransition().finally(() => {
          transitionPendingRef.current = false;
        });
      }, 100);
    }
  }, [hasUserInteraction, isTransitioning, playVideoTransition, handleUserInteraction]);

  // Effet pour les changements de mode UV uniquement - avec dépendances correctes
  useEffect(() => {
    if (!isFirstLoad && isTorchActive !== undefined && hasUserInteraction && initialSetupCompleteRef.current) {
      console.log("Mode UV changé à:", uvMode, "- Lancement de la transition...");
      // Utiliser setTimeout pour éviter les problèmes de timing
      const timer = setTimeout(() => playVideoTransition(), 100);
      return () => clearTimeout(timer);
    }
  }, [uvMode, isFirstLoad, playVideoTransition, isTorchActive, hasUserInteraction]);

  // Écouter les événements de navigation
  useEffect(() => {
    console.log("Enregistrement du listener de transition vidéo");
    const unregister = navigation.registerVideoTransitionListener(() => {
      console.log("Événement de navigation détecté, lancement de la transition vidéo");
      executeTransition();
    });
    
    return unregister;
  }, [navigation, executeTransition]);
  
  // Initialisation et gestion de la visibilité - séparé en un effect distinct pour éviter les boucles
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Configuration initiale unique
    if (isFirstLoad) {
      videoElement.load();
      videoElement.pause();
      videoElement.currentTime = 0;
      setIsFirstLoad(false);
      console.log('Vidéo initialisée avec source:', currentVideo);
      
      // Marquer l'initialisation comme terminée après un court délai
      setTimeout(() => {
        initialSetupCompleteRef.current = true;
      }, 500);
    }
    
    // Gestion de la visibilité de la page
    const handleVisibilityChange = () => {
      if (!videoElement) return;
      
      if (document.hidden) {
        videoElement.pause();
      } else if (hasUserInteraction && isTransitioning) {
        videoElement.play().catch(err => {
          console.error('Erreur lors de la reprise de lecture:', err);
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (videoElement) {
        // Ne pas mettre en pause la vidéo lors du démontage pour éviter les effets secondaires
      }
    };
  }, [isFirstLoad, currentVideo, setIsFirstLoad, hasUserInteraction, isTransitioning, videoRef]);
  
  // Ajout des écouteurs pour la première interaction utilisateur - séparé pour éviter les conflits
  useEffect(() => {
    if (hasUserInteraction) return; // Ne rien faire si l'interaction est déjà détectée
    
    const handleInteraction = () => {
      handleUserInteraction();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [handleUserInteraction, hasUserInteraction]);
  
  // Écouter l'activation de la torche - dans un effet séparé
  useEffect(() => {
    if (!initialSetupCompleteRef.current || isFirstLoad || isTorchActive === undefined || !hasUserInteraction) {
      return;
    }
    
    // Si la torche vient d'être activée, s'assurer que la bonne vidéo est sélectionnée
    const videoElement = videoRef.current;
    if (videoElement && videoElement.src !== currentVideo) {
      console.log("Torche changée, mise à jour de la source vidéo:", currentVideo);
      videoElement.src = currentVideo;
      videoElement.load();
    }
  }, [isTorchActive, isFirstLoad, currentVideo, hasUserInteraction, videoRef]);
};
