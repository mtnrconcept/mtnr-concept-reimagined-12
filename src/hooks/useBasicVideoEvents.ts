
import { useState, useRef, useCallback } from 'react';

interface UseBasicVideoEventsOptions {
  onVideoError?: (src: string, error: Event | null) => void;
  onVideoLoaded?: (src: string) => void;
}

/**
 * Hook providing basic video element event handlers
 */
export const useBasicVideoEvents = ({ 
  onVideoError, 
  onVideoLoaded 
}: UseBasicVideoEventsOptions = {}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  
  const handleVideoLoad = useCallback((e?: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const target = e?.target as HTMLVideoElement;
    const src = target?.src || videoElementRef.current?.src || '';
    
    setIsVideoLoaded(true);
    setVideoError(false);
    console.info("✓ Vidéo chargée avec succès:", src);
    
    // Tenter de démarrer la lecture automatiquement
    if (target) {
      target.play().catch(err => {
        console.warn("Lecture automatique impossible, attente d'interaction utilisateur:", err);
      });
    }
    
    if (onVideoLoaded) {
      onVideoLoaded(src);
    }
  }, [onVideoLoaded]);

  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const target = e.target as HTMLVideoElement;
    const src = target.src;
    console.error("Erreur de chargement vidéo:", e);
    console.error("Source de la vidéo qui a échoué:", src);
    setVideoError(true);
    setIsVideoLoaded(false);
    
    if (onVideoError) {
      onVideoError(src, e.nativeEvent);
    }
  }, [onVideoError]);
  
  // Fonction pour réinitialiser l'état de chargement
  const resetLoadState = useCallback(() => {
    setIsVideoLoaded(false);
    setVideoError(false);
  }, []);
  
  return {
    isVideoLoaded,
    videoError,
    handleVideoLoad,
    handleVideoError,
    resetLoadState,
    videoElementRef
  };
};
