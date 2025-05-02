
import { useCallback, useEffect } from 'react';
import { RefObject } from 'react';

interface UseVideoErrorHandlingProps {
  videoRef: RefObject<HTMLVideoElement>;
  videoError: boolean;
  setVideoError: (value: boolean) => void;
  retryCount: number;
  setRetryCount: (value: number) => void;
  maxRetries: number;
  currentVideoUrl: string;
}

export const useVideoErrorHandling = ({
  videoRef,
  videoError,
  setVideoError,
  retryCount,
  setRetryCount,
  maxRetries,
  currentVideoUrl
}: UseVideoErrorHandlingProps) => {
  
  // Gestion des erreurs vidéo avec logique de nouvelle tentative
  const handleVideoError = useCallback(() => {
    if (retryCount < maxRetries) {
      console.log(`Retrying video playback (${retryCount + 1}/${maxRetries})...`);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 1000);
    } else {
      console.error("Max retries reached, falling back to image");
      setVideoError(true);
    }
  }, [retryCount, maxRetries, setRetryCount, setVideoError]);

  // Réinitialiser le compteur de tentatives lorsque l'URL de la vidéo change
  useEffect(() => {
    setRetryCount(0);
  }, [currentVideoUrl, setRetryCount]);

  // Fonction pour réessayer la lecture de la vidéo
  const retryVideo = useCallback(() => {
    setVideoError(false);
    setRetryCount(0);
    
    if (videoRef.current) {
      videoRef.current.src = currentVideoUrl;
      videoRef.current.load();
      videoRef.current.play().catch(err => {
        console.error("Retry failed:", err);
        handleVideoError();
      });
    }
  }, [currentVideoUrl, handleVideoError, setRetryCount, setVideoError, videoRef]);

  return {
    handleVideoError,
    retryVideo
  };
};
