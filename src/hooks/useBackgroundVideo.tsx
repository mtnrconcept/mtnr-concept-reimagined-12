
import { useRef, useState, useCallback } from 'react';
import { useVideoErrorHandling } from './video/useVideoErrorHandling';
import { useVideoTransition } from './video/useVideoTransition';
import { useUVModeChange } from './useUVModeChange';
import { useNavigationHandler } from './video/useNavigation';
import { useTorchHandler } from './video/useTorchHandler';
import { useDurationChange } from './video/useDurationChange';
import { UseBackgroundVideoProps, UseBackgroundVideoReturn } from './video/types';

export function useBackgroundVideo({
  videoUrl = "/lovable-uploads/videonormale.mp4",
  videoUrlUV = "/lovable-uploads/videouv.mp4",
  autoPlay = false
}: UseBackgroundVideoProps = {}): UseBackgroundVideoReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(videoUrl);
  const [videoError, setVideoError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // État initial pour la vidéo
  const videoState = {
    isFirstLoad,
    isTransitioning,
    currentVideo,
    videoError,
    retryCount
  };
  
  // Actions pour manipuler l'état de la vidéo
  const videoActions = {
    setIsFirstLoad,
    setIsTransitioning,
    setCurrentVideo,
    setVideoError,
    setRetryCount,
    playVideoTransition: () => {}, // Will be replaced
    handleVideoDurationChange: () => {} // Will be replaced
  };
  
  // Hook pour gérer la transition vidéo
  const { playVideoTransition } = useVideoTransition({
    videoRef,
    videoState,
    videoActions
  });
  
  // Mise à jour des actions avec les fonctions réelles
  videoActions.playVideoTransition = playVideoTransition;
  
  // Hook pour gérer le changement de mode UV (sans lecture automatique)
  const { uvMode, isTorchActive } = useUVModeChange({
    videoUrl,
    videoUrlUV,
    videoState,
    videoActions
  });
  
  // Hook pour gérer les erreurs vidéo (sans l'image de fallback)
  useVideoErrorHandling({
    videoRef,
    videoState,
    videoActions
  });
  
  // Hook pour gérer la navigation (avec lecture de la vidéo)
  useNavigationHandler({
    videoRef,
    videoState,
    videoActions
  });
  
  // Hook pour gérer l'activation/désactivation de la torche (sans lecture)
  useTorchHandler({
    isTorchActive,
    isFirstLoad,
    playVideoTransition
  });
  
  // Hook pour gérer le changement de durée de la vidéo
  const { handleVideoDurationChange } = useDurationChange({
    videoRef
  });
  
  // Mise à jour des actions avec la fonction réelle
  videoActions.handleVideoDurationChange = handleVideoDurationChange;
  
  return {
    videoRef,
    isFirstLoad,
    isTransitioning,
    currentVideo,
    videoError,
    retryCount,
    uvMode,
    isTorchActive,
    setIsFirstLoad,
    setIsTransitioning,
    setCurrentVideo,
    setVideoError,
    setRetryCount,
    playVideoTransition,
    handleVideoDurationChange
  };
}

export default useBackgroundVideo;
