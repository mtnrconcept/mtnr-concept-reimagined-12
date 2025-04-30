
import { useState, useRef, useCallback } from 'react';

interface UseVideoLoadOptions {
  fallbackImage?: string;
  onVideoError?: (src: string, error: Event | null) => void;
  onVideoLoaded?: (src: string) => void;
}

export const useVideoLoad = ({ fallbackImage, onVideoError, onVideoLoaded }: UseVideoLoadOptions = {}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  
  const handleVideoLoad = useCallback((e?: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const target = e?.target as HTMLVideoElement;
    const src = target?.src || videoElementRef.current?.src || '';
    
    setIsVideoLoaded(true);
    setVideoError(false);
    console.log("Vidéo chargée avec succès:", src);
    
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
      // Vérifier si l'URL est accessible
      const response = await fetch(videoUrl, { method: 'HEAD' });
      if (!response.ok) {
        console.error(`La vidéo ${videoUrl} n'est pas accessible. Status: ${response.status}`);
        return false;
      }
      
      // Test plus avancé avec un élément vidéo
      return new Promise((resolve) => {
        const tempVideo = document.createElement('video');
        tempVideo.muted = true;
        tempVideo.preload = 'metadata';
        
        const onSuccess = () => {
          tempVideo.removeEventListener('loadedmetadata', onSuccess);
          tempVideo.removeEventListener('error', onError);
          clearTimeout(timeout);
          resolve(true);
        };
        
        const onError = () => {
          tempVideo.removeEventListener('loadedmetadata', onSuccess);
          tempVideo.removeEventListener('error', onError);
          clearTimeout(timeout);
          resolve(false);
        };
        
        // Timeout de sécurité
        const timeout = setTimeout(() => {
          tempVideo.removeEventListener('loadedmetadata', onSuccess);
          tempVideo.removeEventListener('error', onError);
          console.warn(`Timeout lors de la vérification de ${videoUrl}`);
          resolve(false);
        }, 5000);
        
        tempVideo.addEventListener('loadedmetadata', onSuccess);
        tempVideo.addEventListener('error', onError);
        
        tempVideo.src = videoUrl;
        tempVideo.load();
      });
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
    fallbackImage,
    videoElementRef
  };
};
