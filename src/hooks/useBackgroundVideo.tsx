
import { useRef, useState, useCallback } from 'react';
import { useVideoErrorHandling } from './video/useVideoErrorHandling';
import { useVideoTransition } from './video/useVideoTransition';
import { useUVModeChange } from './video/useUVModeChange';
import { useNavigationHandler } from './video/useNavigation';
import { useTorchHandler } from './video/useTorchHandler';
import { useDurationChange } from './video/useDurationChange';
import { UseBackgroundVideoProps, UseBackgroundVideoReturn } from './video/types';

export function useBackgroundVideo({
  videoUrl = "/lovable-uploads/videonormale.mp4",
  videoUrlUV = "/lovable-uploads/videouv.mp4",
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png",
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
  
  // Création d'une fonction playVideoTransition memoizée
  const playVideoTransitionCallback = useCallback((): void => {
    // Cette fonction sera remplacée par l'implémentation de useVideoTransition
  }, []);
  
  // Création d'une fonction handleVideoDurationChange memoizée
  const handleVideoDurationChangeCallback = useCallback(() => {
    // Cette fonction sera remplacée par l'implémentation de useDurationChange
  }, []);
  
  // Actions pour manipuler l'état de la vidéo
  const videoActions = {
    setIsFirstLoad,
    setIsTransitioning,
    setCurrentVideo,
    setVideoError,
    setRetryCount,
    playVideoTransition: playVideoTransitionCallback,
    handleVideoDurationChange: handleVideoDurationChangeCallback
  };
  
  // Hook pour gérer la transition vidéo
  const { playVideoTransition } = useVideoTransition({
    videoRef,
    videoState,
    videoActions
  });
  
  // Mise à jour des actions avec les fonctions réelles
  videoActions.playVideoTransition = playVideoTransition;
  
  // Hook pour gérer le changement de mode UV
  const { uvMode, isTorchActive } = useUVModeChange({
    videoUrl,
    videoUrlUV,
    videoState,
    videoActions
  });
  
  // Hook pour gérer les erreurs vidéo
  useVideoErrorHandling({
    videoRef,
    videoState,
    videoActions,
    fallbackImage
  });
  
  // Hook pour gérer la navigation
  useNavigationHandler({
    videoRef,
    videoState,
    videoActions
  });
  
  // Hook pour gérer l'activation/désactivation de la torche
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
    fallbackImage,
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
