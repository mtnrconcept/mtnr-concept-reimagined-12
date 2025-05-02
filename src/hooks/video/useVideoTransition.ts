
import { useCallback } from "react";
import { VideoState, VideoActions } from "./types";

interface UseVideoTransitionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoState: Pick<VideoState, "isTransitioning">;
  videoActions: Pick<VideoActions, "setIsTransitioning">;
}

export function useVideoTransition({
  videoRef,
  videoState,
  videoActions,
}: UseVideoTransitionProps) {
  const { isTransitioning } = videoState;
  const { setIsTransitioning } = videoActions;

  const playVideoTransition = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || isTransitioning) return;
    
    try {
      console.log('Transition vidéo déclenchée (torche ou navigation)');
      setIsTransitioning(true);
      videoElement.load(); // Recharge la vidéo avec la source actuelle
      videoElement.currentTime = 0;
      videoElement.playbackRate = 1.0;
      
      // Ajouter l'écouteur d'événement 'ended' avant de lancer la lecture
      const handleVideoEnded = () => {
        console.log('Vidéo terminée, mise en pause');
        videoElement.pause();
        videoElement.currentTime = 0;
        setIsTransitioning(false);
        // Retirer l'écouteur pour éviter des déclenchements multiples
        videoElement.removeEventListener('ended', handleVideoEnded);
      };
      
      // S'assurer qu'on n'a pas d'écouteurs en double
      videoElement.removeEventListener('ended', handleVideoEnded);
      // Ajouter l'écouteur d'événement
      videoElement.addEventListener('ended', handleVideoEnded);
      
      await videoElement.play();
    } catch (error) {
      console.error('Erreur lors de la lecture de la vidéo:', error);
      setIsTransitioning(false);
      if (videoElement) {
        videoElement.removeEventListener('ended', () => {});
      }
    }
  }, [videoRef, isTransitioning, setIsTransitioning]);

  return { playVideoTransition };
}
