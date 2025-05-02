
import { useState, useRef } from 'react';
import { useUVMode } from '@/components/effects/UVModeContext';
import { useVideoInteraction } from './video/useVideoInteraction';
import { useVideoErrorHandling } from './video/useVideoErrorHandling';
import { useVideoTransition } from './video/useVideoTransition';
import { UseBackgroundVideoProps, UseBackgroundVideoReturn } from './video/types';

export const useBackgroundVideo = ({
  videoUrl,
  videoUrlUV,
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png"
}: UseBackgroundVideoProps): UseBackgroundVideoReturn => {
  // Références et états
  const videoRef = useRef<HTMLVideoElement>(null);
  const { uvMode } = useUVMode();
  
  // États vidéo
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [hasUserInteraction, setHasUserInteraction] = useState(false);
  
  // Constantes
  const maxRetries = 3;
  
  // Déterminer l'URL de la vidéo actuelle en fonction du mode UV
  const currentVideo = uvMode ? videoUrlUV : videoUrl;

  // Utiliser les modules spécialisés
  const { handleUserInteraction } = useVideoInteraction({
    videoRef,
    hasUserInteraction,
    setHasUserInteraction,
    videoError
  });

  const { handleVideoError, retryVideo } = useVideoErrorHandling({
    videoRef,
    videoError,
    setVideoError,
    retryCount,
    setRetryCount,
    maxRetries,
    currentVideoUrl: currentVideo
  });

  const { playVideoTransition } = useVideoTransition({
    videoRef,
    isPlaying,
    setIsPlaying,
    currentVideoUrl: currentVideo,
    isFirstLoad,
    setIsFirstLoad,
    handleVideoError
  });

  return {
    videoRef,
    videoError,
    setVideoError,
    isPlaying,
    isTransitioning: isPlaying, // Pour compatibilité avec l'API existante
    isFirstLoad,
    setIsFirstLoad,
    hasUserInteraction,
    setHasUserInteraction,
    currentVideo,
    playVideoTransition,
    handleUserInteraction,
    retryVideo,
    fallbackImage,
    uvMode
  };
};
