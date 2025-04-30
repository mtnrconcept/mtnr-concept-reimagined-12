
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
    return uvMode ? videoUrl : videoUrlUV;
  }, [uvMode, videoUrl, videoUrlUV]);

  // Fonction pour gérer la première interaction utilisateur
  const handleUserInteraction = useCallback(() => {
    if (!hasUserInteraction) {
      setHasUserInteraction(true);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    }
  }, [hasUserInteraction]);

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
        
        // Attendre que les métadonnées soient chargées avant de continuer
        if (videoElement.readyState < 2) {
          await new Promise((resolve) => {
            const handleMetadata = () => {
              videoElement.removeEventListener('loadedmetadata', handleMetadata);
              resolve(null);
            };
            videoElement.addEventListener('loadedmetadata', handleMetadata);
          });
        }
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
      
      videoElement.removeEventListener('ended', handleVideoEnded);
      videoElement.addEventListener('ended', handleVideoEnded);
      
      console.log('Lecture de la vidéo...');
      await videoElement.play();
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
