
import { useState, useRef, useCallback } from 'react';

interface UseVideoLoadOptions {
  onVideoError?: (src: string, error: Event | null) => void;
  onVideoLoaded?: (src: string) => void;
}

export const useVideoLoad = ({ onVideoError, onVideoLoaded }: UseVideoLoadOptions = {}) => {
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
  
  const verifyVideoPlayability = useCallback(async (videoUrl: string): Promise<boolean> => {
    try {
      console.log(`Vérification de jouabilité pour: ${videoUrl}`);
      
      // Vérifier uniquement les métadonnées au lieu de l'ensemble du fichier
      const response = await fetch(videoUrl, { 
        method: 'HEAD',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!response.ok) {
        console.error(`La vidéo ${videoUrl} n'est pas accessible. Status: ${response.status}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la vérification de ${videoUrl}:`, error);
      return false;
    }
  }, []);
  
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
    verifyVideoPlayability,
    resetLoadState,
    videoElementRef
  };
};
