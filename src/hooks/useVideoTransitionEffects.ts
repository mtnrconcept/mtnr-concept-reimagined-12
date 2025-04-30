
import { useEffect } from 'react';
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
  isTransitioning,
  hasUserInteraction,
  currentVideo,
  playVideoTransition,
  handleUserInteraction,
  uvMode,
  isTorchActive
}: UseVideoTransitionEffectsProps) => {
  const navigation = useNavigation();

  // Effet pour les changements de mode UV et l'activation de la torche
  useEffect(() => {
    if (!isFirstLoad && isTorchActive && hasUserInteraction && !isTransitioning) {
      console.log("Torche active:", isTorchActive, "Mode UV:", uvMode);
      // Utiliser setTimeout pour éviter les problèmes de timing
      const timer = setTimeout(() => {
        console.log("Déclenchement de la transition vidéo");
        playVideoTransition();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [uvMode, isTorchActive, isFirstLoad, playVideoTransition, hasUserInteraction, isTransitioning]);

  // Écouter les événements de navigation
  useEffect(() => {
    const handleVideoTransition = () => {
      if (hasUserInteraction && !isTransitioning) {
        playVideoTransition();
      }
    };
    
    const unregister = navigation.registerVideoTransitionListener(handleVideoTransition);
    return unregister;
  }, [navigation, playVideoTransition, hasUserInteraction, isTransitioning]);
  
  // Gestion des écouteurs d'événements pour la première interaction
  useEffect(() => {
    const handleInteraction = () => {
      handleUserInteraction();
      // Tenter de lire la vidéo après l'interaction utilisateur
      if (isTorchActive && !isTransitioning) {
        setTimeout(() => playVideoTransition(), 100);
      }
    };
    
    // Ajout des écouteurs pour la première interaction utilisateur
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    
    // Gestion de la visibilité de la page
    const handleVisibilityChange = () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;
      
      if (document.hidden) {
        videoElement.pause();
      } else if (!isFirstLoad && isTransitioning && hasUserInteraction) {
        videoElement.play().catch(err => {
          console.error('Erreur lors de la reprise de lecture:', err);
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [handleUserInteraction, videoRef, isFirstLoad, isTransitioning, hasUserInteraction, isTorchActive, playVideoTransition]);
};
