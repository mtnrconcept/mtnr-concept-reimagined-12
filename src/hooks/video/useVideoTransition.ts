
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

  // Fonction de transition vidéo - désormais elle joue la vidéo et la remet en pause à la fin
  const playVideoTransition = useCallback((): void => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    setIsTransitioning(true);
    
    // Remettre la vidéo au début pour la transition
    videoElement.currentTime = 0;
    
    // Lancer la lecture et mettre en place un gestionnaire pour mettre en pause à la fin
    videoElement.play()
      .then(() => {
        console.log('Transition vidéo lancée');
        
        // Cette fonction sera remplacée par le gestionnaire d'événements 'ended'
        // dans le composant BackgroundVideo, qui mettra la vidéo en pause
      })
      .catch(error => {
        console.error('Erreur lors de la lecture de la vidéo de transition:', error);
        setIsTransitioning(false);
      });
  }, [videoRef, setIsTransitioning]);

  return { playVideoTransition };
}
