
import { useEffect, useRef, useCallback } from "react";
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

  // Fonction memoizée pour éviter les créations multiples
  const handleTransition = useCallback(() => {
    // Éviter les déclenchements multiples
    if (transitionRequestedRef.current) return;
    
    transitionRequestedRef.current = true;
    console.log('Déclenchement de transition reçu du NavigationContext');
    
    // Jouer la transition immédiatement
    playVideoTransition();
    
    // Réinitialisation après un délai pour permettre d'autres transitions
    setTimeout(() => {
      transitionRequestedRef.current = false;
    }, 1000);
    
  }, [playVideoTransition]);

  // Écouter les événements de navigation pour jouer la vidéo instantanément
  useEffect(() => {
    const unregister = navigation.registerVideoTransitionListener(handleTransition);
    return unregister;
  }, [navigation, handleTransition]);
  
  // Gestion de la lecture/pause de la vidéo lors des transitions de page
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Vérifier si le chemin a vraiment changé
    if (prevPathRef.current !== location.pathname) {
      console.log(`Navigation détectée: ${prevPathRef.current} -> ${location.pathname}`);
      prevPathRef.current = location.pathname;
      
      if (isFirstLoad) {
        // À la première charge, préparer la vidéo sans la jouer
        videoElement.load();
        setIsFirstLoad(false);
        console.log('Vidéo initialisée, prête pour la première transition');
      } else {
        // Déclencher automatiquement la transition vidéo lors d'un changement de page
        playVideoTransition();
      }
    }
    
    // Gestion de la visibilité de la page
    const handleVisibilityChange = () => {
      if (document.hidden && videoElement) {
        videoElement.pause();
        console.log('Page non visible, vidéo en pause');
      } else if (!document.hidden && !isFirstLoad) {
        // Possibilité de relancer la vidéo quand l'utilisateur revient sur la page
        // mais uniquement si ce n'est pas le premier chargement
        // Commenter pour désactiver cette fonctionnalité
        // playVideoTransition();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, isFirstLoad, videoRef, setIsFirstLoad, playVideoTransition]);
}
