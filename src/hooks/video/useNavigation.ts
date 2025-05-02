
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigation } from "../../components/effects/NavigationContext";
import { VideoState, VideoActions } from "./types";

interface UseNavigationProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoState: Pick<VideoState, "isFirstLoad">;
  videoActions: Pick<VideoActions, "setIsFirstLoad" | "playVideoTransition">;
}

export function useNavigationHandler({
  videoRef,
  videoState,
  videoActions,
}: UseNavigationProps) {
  const location = useLocation();
  const navigation = useNavigation();
  const { isFirstLoad } = videoState;
  const { setIsFirstLoad, playVideoTransition } = videoActions;

  // Écouter les événements de navigation pour jouer la vidéo instantanément
  useEffect(() => {
    const unregister = navigation.registerVideoTransitionListener(() => {
      // On ne change pas la vidéo lors de la navigation, on joue juste la transition
      playVideoTransition();
    });
    return unregister;
  }, [navigation, playVideoTransition]);
  
  // Gestion de la lecture/pause de la vidéo lors des transitions de page
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isFirstLoad) {
      // À la première charge, mettre la vidéo en pause
      videoElement.pause();
      videoElement.currentTime = 0;
      setIsFirstLoad(false);
      console.log('Vidéo initialisée en pause');
    } else {
      // Lors des changements de route, jouer la vidéo une seule fois
      playVideoTransition();
    }
    
    // Gestion de la visibilité de la page
    const handleVisibilityChange = () => {
      if (document.hidden && videoElement) {
        videoElement.pause();
        console.log('Page non visible, vidéo en pause');
      } else if (videoElement && !isFirstLoad) {
        videoElement.play().catch(err => {
          console.error('Erreur lors de la reprise de lecture:', err);
        });
        console.log('Page à nouveau visible, reprise de la lecture');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (videoElement) {
        videoElement.pause();
        // Retirer tous les écouteurs d'événements
        videoElement.removeEventListener('ended', () => {});
      }
    };
  }, [location.pathname, isFirstLoad, videoRef, setIsFirstLoad, playVideoTransition]);
}
