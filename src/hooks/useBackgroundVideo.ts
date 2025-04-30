
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUVMode } from '@/components/effects/UVModeContext';
import { useTorch } from '@/components/effects/TorchContext';

interface UseBackgroundVideoProps {
  videoUrl: string;
  videoUrlUV: string;
}

export const useBackgroundVideo = ({ videoUrl, videoUrlUV }: UseBackgroundVideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { uvMode } = useUVMode();
  const { isTorchActive } = useTorch();
  
  // États locaux avec valeurs initiales correctes
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasUserInteraction, setHasUserInteraction] = useState(false);
  
  // Définir le bon chemin de vidéo basé sur le mode UV
  const currentVideo = useMemo(() => {
    return uvMode ? videoUrlUV : videoUrl;
  }, [uvMode, videoUrl, videoUrlUV]);

  // Fonction pour gérer la première interaction utilisateur
  const handleUserInteraction = useCallback(() => {
    if (!hasUserInteraction) {
      setHasUserInteraction(true);
    }
  }, [hasUserInteraction]);

  // Effectuer un changement de source vidéo lorsque le mode UV change
  useEffect(() => {
    if (!isFirstLoad && videoRef.current && hasUserInteraction) {
      console.log('Mode UV changé, source vidéo mise à jour:', currentVideo);
      videoRef.current.src = currentVideo;
      videoRef.current.load();
      
      // Si la torche est active, lancer automatiquement la vidéo
      if (isTorchActive) {
        playVideoTransition();
      }
    }
  }, [uvMode]); // Dépend uniquement du changement de mode UV

  // Version optimisée de playVideoTransition avec useCallback
  const playVideoTransition = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || isTransitioning) return;
    
    try {
      console.log('Tentative de transition vidéo - Mode UV:', uvMode);
      setIsTransitioning(true);
      
      // S'assurer que la vidéo est chargée avec la bonne source avant de jouer
      if (videoElement.src !== currentVideo) {
        console.log('Changement de source vidéo vers:', currentVideo);
        videoElement.src = currentVideo;
        await new Promise<void>((resolve) => {
          const handleLoadedData = () => {
            videoElement.removeEventListener('loadeddata', handleLoadedData);
            resolve();
          };
          videoElement.addEventListener('loadeddata', handleLoadedData);
          videoElement.load();
        });
      }
      
      videoElement.currentTime = 0;
      videoElement.playbackRate = 1.0;
      
      // Ajouter l'écouteur d'événement 'ended' avant de lancer la lecture
      const handleVideoEnded = () => {
        console.log('Vidéo terminée, mise en pause');
        if (videoElement) {
          videoElement.pause();
          videoElement.currentTime = 0;
        }
        setIsTransitioning(false);
        videoElement.removeEventListener('ended', handleVideoEnded);
      };
      
      videoElement.addEventListener('ended', handleVideoEnded);
      
      console.log('Lecture de la vidéo...', currentVideo);
      await videoElement.play().catch(error => {
        console.error('Erreur de lecture automatique:', error);
        // Essayer de jouer avec son muet explicitement
        videoElement.muted = true;
        return videoElement.play();
      });
    } catch (error) {
      console.error('Erreur lors de la lecture de la vidéo:', error);
      setIsTransitioning(false);
    }
  }, [isTransitioning, currentVideo, uvMode]);

  return {
    videoRef,
    isFirstLoad,
    setIsFirstLoad,
    isTransitioning,
    setIsTransitioning,
    hasUserInteraction,
    setHasUserInteraction,
    currentVideo,
    handleUserInteraction,
    playVideoTransition,
    uvMode,
    isTorchActive
  };
};
