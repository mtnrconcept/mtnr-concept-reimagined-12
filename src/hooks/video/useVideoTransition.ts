
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

  // Fonction de transition vidéo - désormais elle joue la vidéo pendant exactement 7 secondes
  const playVideoTransition = useCallback((): void => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    setIsTransitioning(true);
    
    // Remettre la vidéo au début pour la transition
    videoElement.currentTime = 0;
    
    // Définir la durée de transition à 7000ms (7 secondes)
    const transitionDuration = window.videoTransitionDuration || 7000;
    
    // Lancer la lecture et mettre en place un gestionnaire pour mettre en pause à la fin
    videoElement.play()
      .then(() => {
        console.log(`Transition vidéo lancée pour ${transitionDuration}ms`);
        
        // Programmer une pause à la fin de la durée de transition
        setTimeout(() => {
          if (videoElement) {
            videoElement.pause();
            console.log('Transition vidéo terminée, vidéo mise en pause');
            setIsTransitioning(false);
          }
        }, transitionDuration);
      })
      .catch(error => {
        console.error('Erreur lors de la lecture de la vidéo de transition:', error);
        setIsTransitioning(false);
      });
  }, [videoRef, setIsTransitioning]);

  return { playVideoTransition };
}
