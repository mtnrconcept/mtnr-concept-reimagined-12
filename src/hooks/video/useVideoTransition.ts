
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

  const playVideoTransition = useCallback(async () => {
    const videoElement = videoRef.current;
    // Vérifier si une transition est déjà en cours pour éviter les appels multiples
    if (!videoElement || transitionInProgressRef.current) return;
    
    // Marquer le début de la transition
    transitionInProgressRef.current = true;
    
    try {
      console.log('Transition vidéo déclenchée (navigation ou torche)');
      setIsTransitioning(true);
      
      // Interrompre tout chargement ou lecture en cours
      videoElement.pause();
      
      // Assurons-nous que la vidéo est prête à être lue depuis le début
      videoElement.currentTime = 0;
      videoElement.playbackRate = 1.0;
      
      // On utilise une promesse pour démarrer la lecture dès que possible
      try {
        // Démarrer la lecture immédiatement sans attendre le chargement complet
        const playPromise = videoElement.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Lecture vidéo démarrée avec succès');
          }).catch(error => {
            if (error.name === 'AbortError') {
              console.info('Lecture vidéo interrompue (comportement normal pendant la navigation)');
            } else {
              console.error('Erreur lors de la lecture de la vidéo:', error);
              // Réessayer une fois en cas d'erreur autre qu'une interruption
              setTimeout(() => {
                videoElement.play().catch(e => {
                  console.warn('Échec de la seconde tentative de lecture:', e);
                  // Nettoyage en cas d'échec définitif
                  setIsTransitioning(false);
                  transitionInProgressRef.current = false;
                });
              }, 50);
            }
          });
        }
      } catch (playError) {
        console.error('Erreur lors du démarrage de la lecture:', playError);
      }

      // Fonction pour gérer la fin de la vidéo
      const handleVideoEnded = () => {
        console.log('Vidéo terminée, mise en pause');
        if (videoElement) {
          videoElement.pause();
          videoElement.currentTime = 0;
        }
        setIsTransitioning(false);
        transitionInProgressRef.current = false;
        // Retirer l'écouteur pour éviter des déclenchements multiples
        videoElement.removeEventListener('ended', handleVideoEnded);
      };
      
      // S'assurer qu'on n'a pas d'écouteurs en double
      videoElement.removeEventListener('ended', handleVideoEnded);
      // Ajouter l'écouteur d'événement
      videoElement.addEventListener('ended', handleVideoEnded);
      
      // Ajouter un timer de sécurité pour réinitialiser l'état si la vidéo ne se termine pas
      const safetyTimer = setTimeout(() => {
        if (transitionInProgressRef.current) {
          console.warn('Timer de sécurité activé: la vidéo n\'a pas terminé dans le délai prévu');
          handleVideoEnded();
        }
      }, 5000); // 5 secondes max pour la transition
      
      return () => {
        clearTimeout(safetyTimer);
        if (videoElement) {
          videoElement.removeEventListener('ended', handleVideoEnded);
        }
      };
      
    } catch (error) {
      console.error('Erreur lors de la transition vidéo:', error);
      setIsTransitioning(false);
      transitionInProgressRef.current = false;
    }
  }, [videoRef, setIsTransitioning]);

  return { playVideoTransition };
}
