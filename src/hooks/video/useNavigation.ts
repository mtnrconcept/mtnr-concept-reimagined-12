
import { useEffect, useRef } from "react";
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
  const prevPathRef = useRef(location.pathname);
  const transitionRequestedRef = useRef(false);

  // Écouter les événements de navigation pour jouer la vidéo instantanément
  useEffect(() => {
    const unregister = navigation.registerVideoTransitionListener(() => {
      // Éviter les déclenchements multiples
      if (!transitionRequestedRef.current) {
        transitionRequestedRef.current = true;
        // On ne change pas la vidéo lors de la navigation, on joue juste la transition
        setTimeout(() => {
          playVideoTransition();
          // Réinitialisation après un délai pour permettre d'autres transitions
          setTimeout(() => {
            transitionRequestedRef.current = false;
          }, 1000);
        }, 50);
      }
    });
    return unregister;
  }, [navigation, playVideoTransition]);
  
  // Gestion de la lecture/pause de la vidéo lors des transitions de page
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Vérifier si le chemin a vraiment changé
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      
      if (isFirstLoad) {
        // À la première charge, mettre la vidéo en pause
        videoElement.pause();
        videoElement.currentTime = 0;
        setIsFirstLoad(false);
        console.log('Vidéo initialisée en pause');
      } else if (!transitionRequestedRef.current) {
        // Éviter les déclenchements multiples de transition
        transitionRequestedRef.current = true;
        setTimeout(() => {
          playVideoTransition();
          // Réinitialisation après un délai
          setTimeout(() => {
            transitionRequestedRef.current = false;
          }, 1000);
        }, 50);
      }
    }
    
    // Gestion de la visibilité de la page
    const handleVisibilityChange = () => {
      if (document.hidden && videoElement) {
        videoElement.pause();
        console.log('Page non visible, vidéo en pause');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (videoElement) {
        videoElement.pause();
      }
    };
  }, [location.pathname, isFirstLoad, videoRef, setIsFirstLoad, playVideoTransition]);
}
