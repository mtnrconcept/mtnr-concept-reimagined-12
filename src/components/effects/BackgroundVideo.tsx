
import React, { useEffect } from 'react';
import { useBackgroundVideo } from '@/hooks/useBackgroundVideo';
import { useVideoTransitionEffects } from '@/hooks/useVideoTransitionEffects';
import { useVideoPreload } from '@/hooks/useVideoPreload';
import { VideoOverlay } from './VideoOverlay';

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  fallbackImage?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ 
  videoUrl = "/lovable-uploads/Composition 1.mp4", 
  videoUrlUV = "/lovable-uploads/Composition 1_1.mp4",
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
    isTorchActive
  } = useBackgroundVideo({ videoUrl, videoUrlUV });

  // Précharger les vidéos
  useVideoPreload({ videoUrls: [videoUrl, videoUrlUV] });
  
  // Gérer les effets de transitions et d'initialisation dans un effet séparé
  useEffect(() => {
    // Initialiser la vidéo au premier chargement
    const videoElement = videoRef.current;
    
    if (!videoElement) return;
    
    // S'assurer que la vidéo a la bonne source dès le début
    if (videoElement.src !== currentVideo) {
      videoElement.src = currentVideo;
      videoElement.load();
    }
    
    if (isFirstLoad) {
      videoElement.load();
      videoElement.pause();
      videoElement.currentTime = 0;
      setIsFirstLoad(false);
      console.log('Vidéo initialisée avec source:', currentVideo);
    }
    
    // Nettoyage
    return () => {
      if (videoElement) {
        videoElement.pause();
      }
    };
  }, [videoRef, isFirstLoad, currentVideo, setIsFirstLoad]);
  
  // Utiliser notre hook pour gérer les effets de transition
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

  // Ajouter un effet pour détecter explicitement les changements de mode UV
  useEffect(() => {
    if (isTorchActive && hasUserInteraction && !isFirstLoad) {
      console.log("Changement détecté - UV:", uvMode, "Torche:", isTorchActive);
      // Petite temporisation pour éviter les conflits
      const timer = setTimeout(() => {
        playVideoTransition();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [uvMode, isTorchActive]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
      {/* Vidéo avec source dynamique */}
      <video
        ref={videoRef}
        className="absolute inset-0 min-w-full min-h-full object-cover"
        poster={fallbackImage}
        playsInline
        muted
        preload="auto"
        src={currentVideo}
      />
      
      {/* Overlays visuels */}
      <VideoOverlay />
      
      {/* Afficher l'état actuel pour le débogage */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-20 right-4 text-xs bg-black/70 text-white p-2 rounded z-50">
          Mode: {uvMode ? 'UV' : 'Normal'} | 
          Torche: {isTorchActive ? 'ON' : 'OFF'} | 
          Vidéo: {currentVideo.split('/').pop()}
        </div>
      )}
    </div>
  );
};

export default BackgroundVideo;
