
import { useState, useRef } from 'react';

interface UseVideoLoadOptions {
  fallbackImage?: string;
}

export const useVideoLoad = ({ fallbackImage }: UseVideoLoadOptions = {}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    console.log("Vidéo fond chargée avec succès");
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const target = e.target as HTMLVideoElement;
    console.error("Erreur de chargement vidéo:", e);
    console.error("Source de la vidéo qui a échoué:", target.src);
    setVideoError(true);
  };
  
  return {
    isVideoLoaded,
    videoError,
    handleVideoLoad,
    handleVideoError,
    fallbackImage
  };
};
