
import { useCallback, useRef } from "react";
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
  const transitionInProgressRef = useRef(false);

  const playVideoTransition = useCallback((): void => {
    const videoElement = videoRef.current;
    
    // Si l'élément vidéo n'est pas disponible, on sort
    if (!videoElement) return;
    
    try {
      console.log('Lecture vidéo démarrée:', videoElement.src);
      
      // Démarrer la lecture immédiatement
      videoElement.currentTime = 0;
      videoElement.play().catch(error => {
        console.error('Erreur lors de la lecture immédiate de la vidéo:', error);
      });
      
    } catch (error) {
      console.error('Erreur lors de la transition vidéo:', error);
    }
  }, [videoRef]);

  return { playVideoTransition };
}
