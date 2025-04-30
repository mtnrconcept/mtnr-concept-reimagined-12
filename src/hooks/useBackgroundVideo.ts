
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
      console.log('Interaction utilisateur détectée, vidéo prête à jouer');
      setHasUserInteraction(true);
    }
  }, [hasUserInteraction]);

  // Version optimisée de playVideoTransition avec useCallback
  const playVideoTransition = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || isTransitioning) {
      console.log('Impossible de démarrer la vidéo: vidéo non chargée ou transition déjà en cours');
      return;
    }
    
    try {
      console.log('Tentative de transition vidéo - Mode UV:', uvMode);
      setIsTransitioning(true);
      
      // Vider le cache avant de jouer
      if (videoElement.src !== currentVideo) {
        console.log('Changement de source vidéo vers:', currentVideo);
        
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
        console.log('Vidéo terminée, mise en pause');
        if (videoElement) {
          videoElement.pause();
          videoElement.currentTime = videoElement.duration - 0.1; // Maintenir la dernière image
        }
        setIsTransitioning(false);
        videoElement.removeEventListener('ended', handleVideoEnded);
      };
      
      videoElement.removeEventListener('ended', handleVideoEnded);
      videoElement.addEventListener('ended', handleVideoEnded);
      
      console.log('Lecture de la vidéo...');
      await videoElement.play();
      console.log('Vidéo démarrée avec succès');
    } catch (error) {
      console.error('Erreur lors de la lecture de la vidéo:', error);
      setIsTransitioning(false);
    }
  }, [isTransitioning, currentVideo, uvMode]);

  // Démarrer automatiquement la vidéo lors du premier chargement
  useEffect(() => {
    if (isFirstLoad && videoRef.current) {
      // Démarrer la transition après le premier rendu complet
      const timer = setTimeout(() => {
        handleUserInteraction();
        if (!isTransitioning) {
          console.log('Démarrage automatique de la vidéo au chargement initial');
          playVideoTransition();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstLoad, isTransitioning, handleUserInteraction, playVideoTransition]);

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
