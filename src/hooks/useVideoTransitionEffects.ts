
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
  const initialSetupCompleteRef = useRef(false);

  // Fonction qui exécute la transition si les conditions sont réunies
  const executeTransition = useCallback(() => {
    if (!hasUserInteraction) {
      // Simuler une interaction utilisateur
      handleUserInteraction();
      setTimeout(() => playVideoTransition(), 100);
    } else if (!isTransitioning) {
      playVideoTransition();
    }
  }, [hasUserInteraction, isTransitioning, playVideoTransition, handleUserInteraction]);

  // Écouter les événements de navigation
  useEffect(() => {
    const unregister = navigation.registerVideoTransitionListener(() => {
      executeTransition();
    });
    
    return unregister;
  }, [navigation, executeTransition]);
  
  // Initialisation
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Configuration initiale unique
    if (isFirstLoad) {
      videoElement.load();
      videoElement.pause();
      videoElement.currentTime = 0;
      setIsFirstLoad(false);
      
      // Marquer l'initialisation comme terminée
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
    };
  }, [isFirstLoad, currentVideo, setIsFirstLoad, hasUserInteraction, isTransitioning, videoRef]);
  
  // Ajout des écouteurs pour la première interaction utilisateur
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
};
