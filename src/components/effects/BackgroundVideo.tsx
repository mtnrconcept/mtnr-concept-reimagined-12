
import React, { useEffect, useRef, useState } from 'react';
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
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
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

  // S'assurer que la vidéo est visible et qu'elle se charge correctement
  useEffect(() => {
    const checkVideo = async () => {
      try {
        const response = await fetch(currentVideo, { method: 'HEAD' });
        console.log(`Vérification de la vidéo ${currentVideo}:`, response.ok);
        
        if (!response.ok) {
          console.error(`La vidéo ${currentVideo} n'est pas accessible. Code: ${response.status}`);
        } else {
          console.log(`La vidéo ${currentVideo} est accessible.`);
        }
      } catch (error) {
        console.error(`Erreur lors de la vérification de la vidéo:`, error);
      }
    };
    
    checkVideo();
    
    // S'assurer que le corps du document a un fond noir
    document.body.style.backgroundColor = '#000';
    document.documentElement.style.backgroundColor = '#000';
    
    return () => {
      // Nettoyage
    };
  }, [currentVideo]);

  // Gestion de l'événement de chargement de la vidéo
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    console.log("Vidéo chargée avec succès");
  };

  // Gestion des erreurs de vidéo
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Erreur de chargement vidéo:", e);
    const videoElement = e.currentTarget;
    console.log("Détails vidéo:", {
      error: videoElement.error,
      networkState: videoElement.networkState,
      readyState: videoElement.readyState,
      currentSrc: videoElement.currentSrc
    });
  };

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden" style={{ backgroundColor: "#000" }}>
      {/* Affichage de l'image de fallback si erreur vidéo */}
      {videoError && (
        <img 
          src={fallbackImage} 
          alt="Background fallback" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.7 }}
        />
      )}
      
      {/* Vidéo d'arrière-plan */}
      <video
        ref={videoRef}
        className="background-video"
        playsInline
        muted
        autoPlay
        loop
        preload="auto"
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        style={{ 
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
      >
        <source src={currentVideo} type="video/mp4" />
        Votre navigateur ne prend pas en charge les vidéos HTML5.
      </video>
      
      {/* Overlays et effets visuels */}
      <VideoOverlay />
    </div>
  );
};

export default BackgroundVideo;
