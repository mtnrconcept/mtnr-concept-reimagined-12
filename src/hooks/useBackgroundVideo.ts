
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
  
  // États locaux avec valeurs initiales
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasUserInteraction, setHasUserInteraction] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  // Définir le bon chemin de vidéo basé sur le mode UV
  const currentVideo = useMemo(() => {
    return uvMode ? videoUrlUV : videoUrl;
  }, [uvMode, videoUrl, videoUrlUV]);

  // Fonction pour gérer la première interaction utilisateur
  const handleUserInteraction = useCallback(() => {
    if (!hasUserInteraction) {
      console.log('Interaction utilisateur détectée, vidéo prête à jouer');
      setHasUserInteraction(true);
    }
  }, [hasUserInteraction]);

  // Version optimisée de playVideoTransition avec useCallback
  const playVideoTransition = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || isTransitioning || videoError) {
      return;
    }
    
    try {
      setIsTransitioning(true);
      
      // Vider le cache avant de jouer si nécessaire
      if (videoElement.src !== currentVideo) {        
        // Retirer l'ancienne source et vider le cache
        videoElement.removeAttribute('src');
        videoElement.load();
        
        // Définir la nouvelle source
        videoElement.src = currentVideo;
        
        // Attendre que les métadonnées soient chargées avant de continuer
        if (videoElement.readyState < 2) {
          await new Promise<void>((resolve) => {
            const handleMetadata = () => {
              videoElement.removeEventListener('loadedmetadata', handleMetadata);
              resolve();
            };
            videoElement.addEventListener('loadedmetadata', handleMetadata);
            
            // Timeout si les métadonnées ne se chargent pas
            setTimeout(() => {
              videoElement.removeEventListener('loadedmetadata', handleMetadata);
              resolve();
            }, 2000);
          });
        }
      }
      
      videoElement.currentTime = 0;
      videoElement.playbackRate = 1.0;
      
      // Ajouter l'écouteur d'événement 'ended' avant de lancer la lecture
      const handleVideoEnded = () => {
        if (videoElement) {
          videoElement.pause();
          videoElement.currentTime = videoElement.duration - 0.1; // Maintenir la dernière image
        }
        setIsTransitioning(false);
        videoElement.removeEventListener('ended', handleVideoEnded);
      };
      
      videoElement.removeEventListener('ended', handleVideoEnded);
      videoElement.addEventListener('ended', handleVideoEnded);
      
      await videoElement.play().catch(error => {
        setIsTransitioning(false);
        setVideoError(true);
      });
    } catch (error) {
      setIsTransitioning(false);
      setVideoError(true);
    }
  }, [isTransitioning, currentVideo, videoError]);

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
    isTorchActive,
    videoError
  };
};
