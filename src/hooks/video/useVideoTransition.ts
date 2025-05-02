
import { useCallback, useEffect, useRef } from 'react';
import { RefObject } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '@/components/effects/NavigationContext';

interface UseVideoTransitionProps {
  videoRef: RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  currentVideoUrl: string;
  isFirstLoad: boolean;
  setIsFirstLoad: (value: boolean) => void;
  handleVideoError: (e?: any) => void;
}

export const useVideoTransition = ({
  videoRef,
  isPlaying,
  setIsPlaying,
  currentVideoUrl,
  isFirstLoad,
  setIsFirstLoad,
  handleVideoError
}: UseVideoTransitionProps) => {
  const location = useLocation();
  const { isTransitioning } = useNavigation();
  const lastLocationRef = useRef(location.pathname);
  
  // Fonction pour jouer la transition vidéo
  const playVideoTransition = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = 0;
    setIsPlaying(true);
    
    try {
      await video.play();
    } catch (error) {
      console.error("Error playing transition video:", error);
      setIsPlaying(false);
    }
  }, [videoRef, setIsPlaying]);

  // Gérer la lecture vidéo lors des changements de route
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Vérifier si la route a changé - ne déclencher la transition que dans ce cas
    if (lastLocationRef.current !== location.pathname) {
      console.log("Location changed: triggering video transition");
      
      // Mettre à jour la référence
      lastLocationRef.current = location.pathname;
      
      // D'abord mettre en pause et réinitialiser la vidéo
      video.pause();
      video.currentTime = 0;
      
      // Configurer et lire la vidéo
      video.src = currentVideoUrl;
      video.load();
      video.muted = true;
      video.playsInline = true;
      video.loop = false;  // Ne pas boucler pendant la transition
      
      setIsPlaying(true);
      
      // Démarrer la lecture
      video.play().then(() => {
        console.log("Transition video playback started");
        
        // Écouter la fin de la vidéo
        const handleEnded = () => {
          console.log("Video transition completed");
          video.loop = true; // Revenir à la lecture en boucle après la transition
          video.play().catch(err => {
            console.error("Failed to restart loop:", err);
          });
          video.removeEventListener('ended', handleEnded);
          setIsPlaying(false);
        };
        
        video.addEventListener('ended', handleEnded, { once: true });
      }).catch(err => {
        console.error("Failed to play transition video:", err);
        setIsPlaying(false);
        handleVideoError();
      });
    } else if (!isPlaying && isFirstLoad) {
      // Configuration initiale de la vidéo d'arrière-plan
      video.src = currentVideoUrl;
      video.load();
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      
      // Essayer la lecture automatique au premier chargement
      video.play().catch(err => {
        console.error("Failed to play background video:", err);
        // Ne pas considérer cela comme une erreur, juste attendre l'interaction utilisateur
      });
      
      setIsFirstLoad(false);
    }
    
    return () => {
      if (video) {
        // Ne pas mettre en pause pendant les transitions
        if (!isTransitioning) {
          video.pause();
        }
      }
    };
  }, [currentVideoUrl, location.pathname, isPlaying, handleVideoError, isFirstLoad, isTransitioning, setIsFirstLoad, setIsPlaying, videoRef]);

  return { playVideoTransition };
};
