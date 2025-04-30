
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

  // Effet pour les changements de mode UV uniquement
  useEffect(() => {
    if (!isFirstLoad && isTorchActive && hasUserInteraction) {
      console.log("Mode UV changé à:", uvMode, "- Lancement de la transition...");
      // Utiliser setTimeout pour éviter les problèmes de timing
      const timer = setTimeout(() => playVideoTransition(), 100);
      return () => clearTimeout(timer);
    }
  }, [uvMode, isFirstLoad, playVideoTransition, isTorchActive, hasUserInteraction]);

  // Écouter les événements de navigation
  useEffect(() => {
    const handleVideoTransition = () => {
      if (hasUserInteraction) {
        playVideoTransition();
      }
    };
    
    const unregister = navigation.registerVideoTransitionListener(handleVideoTransition);
    return unregister;
  }, [navigation, playVideoTransition, hasUserInteraction]);
  
  // Écouter l'activation de la torche
  useEffect(() => {
    if (!isFirstLoad && isTorchActive !== undefined && hasUserInteraction) {
      // Si la torche vient d'être activée, s'assurer que la bonne vidéo est sélectionnée
      const videoElement = videoRef.current;
      if (videoElement && videoElement.src !== currentVideo) {
        console.log("Torche changée, mise à jour de la source vidéo:", currentVideo);
        videoElement.src = currentVideo;
        videoElement.load();
      }
    }
  }, [isTorchActive, isFirstLoad, currentVideo, hasUserInteraction, videoRef]);
  
  // Initialisation et gestion de la visibilité
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // S'assurer que la vidéo a la bonne source dès le début
    if (videoElement.src !== currentVideo) {
      videoElement.src = currentVideo;
    }
    
    if (isFirstLoad) {
      videoElement.load();
      videoElement.pause();
      videoElement.currentTime = 0;
      setIsFirstLoad(false);
      console.log('Vidéo initialisée avec source:', currentVideo);
    }
    
    // Ajout des écouteurs pour la première interaction utilisateur
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    // Gestion de la visibilité de la page
    const handleVisibilityChange = () => {
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
      
      if (videoElement) {
        videoElement.pause();
      }
    };
  }, [isFirstLoad, isTransitioning, currentVideo, handleUserInteraction, hasUserInteraction, videoRef, setIsFirstLoad]);
};
