
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
  const [directSrc, setDirectSrc] = useState<string>(videoUrl);
  
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

  // Vérifier si les vidéos sont accessibles
  useEffect(() => {
    const checkVideoFile = async (url: string) => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`Vidéo ${url} accessible:`, response.ok, "status:", response.status);
        if (response.ok) {
          setDirectSrc(url);
        } else {
          console.error(`La vidéo ${url} n'est pas accessible. Status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Erreur lors de la vérification de la vidéo ${url}:`, error);
      }
    };
    
    // Vérifier et définir la source directe
    checkVideoFile(currentVideo);
    
    // S'assurer que le corps du document a un fond noir
    document.body.style.backgroundColor = '#000';
    
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [currentVideo]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      {/* Fallback image pour les cas où la vidéo ne fonctionne pas */}
      <img 
        src={fallbackImage} 
        alt="Studio background fallback" 
        style={{
          position: 'absolute',
          inset: 0,
          minWidth: '100%',
          minHeight: '100%',
          objectFit: 'cover',
          opacity: 0.3,
          display: videoError ? 'block' : 'none'
        }}
      />
      
      {/* Vidéo avec source directement définie */}
      <video
        ref={videoRef}
        className="background-video"
        playsInline
        muted
        preload="auto"
        style={{ 
          display: videoError ? 'none' : 'block',
        }}
      >
        <source src={directSrc} type="video/mp4" />
        Votre navigateur ne prend pas en charge les vidéos HTML5.
      </video>
      
      {/* Overlays visuels */}
      <VideoOverlay />
    </div>
  );
};

export default BackgroundVideo;
