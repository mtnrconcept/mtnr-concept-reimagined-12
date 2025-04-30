
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

  // Effet pour les changements de mode UV uniquement
  useEffect(() => {
    if (!isFirstLoad && isTorchActive && hasUserInteraction && !isTransitioning) {
      console.log("Mode UV changé à:", uvMode, "- Lancement de la transition...");
      // Utiliser setTimeout pour éviter les problèmes de timing
      const timer = setTimeout(() => playVideoTransition(), 100);
      return () => clearTimeout(timer);
    }
  }, [uvMode, isFirstLoad, playVideoTransition, isTorchActive, hasUserInteraction, isTransitioning]);

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
  
  // Écouter l'activation de la torche
  useEffect(() => {
    if (!isFirstLoad && isTorchActive !== undefined && hasUserInteraction && !isTransitioning) {
      // Si la torche vient d'être activée, s'assurer que la bonne vidéo est sélectionnée
      const videoElement = videoRef.current;
      if (videoElement && videoElement.src !== currentVideo) {
        console.log("Torche changée, mise à jour de la source vidéo:", currentVideo);
        videoElement.src = currentVideo;
        videoElement.load();
      }
    }
  }, [isTorchActive, isFirstLoad, currentVideo, hasUserInteraction, videoRef, isTransitioning]);
  
  // Gestion des écouteurs d'événements pour la première interaction
  useEffect(() => {
    // Ajout des écouteurs pour la première interaction utilisateur
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
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
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [handleUserInteraction, videoRef, isFirstLoad, isTransitioning, hasUserInteraction]);
};
