
import { useEffect, useCallback } from 'react';
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

  // Fonction qui exécute la transition si les conditions sont réunies
  const executeTransition = useCallback(() => {
    if (!hasUserInteraction) {
      handleUserInteraction();
      setTimeout(() => playVideoTransition(), 100);
    } else if (!isTransitioning) {
      playVideoTransition();
    }
  }, [hasUserInteraction, isTransitioning, playVideoTransition, handleUserInteraction]);

  // Écouter les événements de navigation
  useEffect(() => {
    const unregister = navigation.registerVideoTransitionListener(() => {
      console.log("Transition vidéo déclenchée par navigation");
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
      console.log("Premier chargement vidéo");
      videoElement.load();
      videoElement.pause(); // Assure que la vidéo est en pause au début
      videoElement.currentTime = 0;
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, videoRef, setIsFirstLoad]);
  
  // Ajout des écouteurs pour la première interaction utilisateur
  useEffect(() => {
    if (hasUserInteraction) return;
    
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
