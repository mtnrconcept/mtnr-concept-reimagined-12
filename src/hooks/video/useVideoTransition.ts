
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
      
      // Assurons-nous que la vidéo est prête à être lue
      videoElement.load();
      videoElement.currentTime = 0;
      videoElement.playbackRate = 1.0;
      
      // Ajout d'un petit délai pour donner le temps à la vidéo de se charger
      await new Promise(resolve => setTimeout(resolve, 100));
      
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
      
      // Utiliser une approche plus robuste pour lire la vidéo
      try {
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          await playPromise;
          console.log('Lecture vidéo démarrée avec succès');
        }
      } catch (playError) {
        console.error('Erreur lors de la lecture de la vidéo:', playError);
        // Gérer les erreurs de lecture spécifiques
        if (playError.name === 'AbortError') {
          console.warn('Lecture vidéo interrompue par une autre action');
        }
        setIsTransitioning(false);
        videoElement.removeEventListener('ended', handleVideoEnded);
      }
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
