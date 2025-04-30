
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
    if (!videoElement || videoError) {
      console.error("Erreur: élément vidéo non disponible ou erreur vidéo");
      return;
    }
    
    try {
      setIsTransitioning(true);
      
      // S'assurer que la vidéo est correctement chargée
      if (videoElement.src !== currentVideo) {
        videoElement.src = currentVideo;
        await new Promise(resolve => {
          videoElement.addEventListener('loadeddata', resolve, { once: true });
        });
      }
      
      // Remettre la vidéo au début
      videoElement.currentTime = 0;
      
      // Ajouter l'écouteur d'événement 'ended' avant de lancer la lecture
      const handleVideoEnded = () => {
        console.log("Vidéo terminée, mise en pause");
        videoElement.pause();
        setIsTransitioning(false);
        videoElement.removeEventListener('ended', handleVideoEnded);
      };
      
      videoElement.removeEventListener('ended', handleVideoEnded);
      videoElement.addEventListener('ended', handleVideoEnded);
      
      // Lancer la lecture de la vidéo
      console.log("Démarrage de la lecture vidéo");
      await videoElement.play().catch(error => {
        console.error("Erreur de lecture vidéo:", error);
        setIsTransitioning(false);
        setVideoError(true);
      });
    } catch (error) {
      console.error("Erreur générale lors de la transition vidéo:", error);
      setIsTransitioning(false);
      setVideoError(true);
    }
  }, [currentVideo, videoError]);

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
