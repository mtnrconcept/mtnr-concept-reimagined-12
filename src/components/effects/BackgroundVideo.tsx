
import React, { useEffect } from 'react';
import { useBackgroundVideo } from '@/hooks/useBackgroundVideo';
import { useVideoTransitionEffects } from '@/hooks/useVideoTransitionEffects';
import { VideoOverlay } from './VideoOverlay';

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  fallbackImage?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ 
  videoUrl = "/lovable-uploads/Video fond normale.mp4", 
  videoUrlUV = "/lovable-uploads/Video fond UV.mp4",
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png"
}) => {
  // Utiliser notre hook personnalisé pour gérer la vidéo
  const {
    videoRef,
    isFirstLoad,
    setIsFirstLoad,
    isTransitioning,
    hasUserInteraction,
    currentVideo,
    handleUserInteraction,
    playVideoTransition,
    uvMode,
    isTorchActive,
    videoError
  } = useBackgroundVideo({ videoUrl, videoUrlUV });

  // Gérer les effets de transitions et d'initialisation
  useVideoTransitionEffects({
    videoRef,
    isFirstLoad,
    setIsFirstLoad,
    isTransitioning,
    hasUserInteraction,
    currentVideo,
    playVideoTransition,
    handleUserInteraction,
    uvMode,
    isTorchActive
  });

  // Ajouter des logs pour déboguer
  useEffect(() => {
    console.log('BackgroundVideo rendering with videoUrl:', videoUrl);
    console.log('Current video path:', currentVideo);
    console.log('Video element exists:', !!videoRef.current);
  }, [videoUrl, currentVideo, videoRef]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
      {/* Vidéo avec source dynamique */}
      <video
        ref={videoRef}
        className="absolute inset-0 min-w-full min-h-full object-cover"
        playsInline
        muted
        preload="auto"
        src={currentVideo}
        style={{ display: 'block' }} // S'assurer que la vidéo est visible
      />
      
      {/* Overlays visuels */}
      <VideoOverlay />
    </div>
  );
};

export default BackgroundVideo;
