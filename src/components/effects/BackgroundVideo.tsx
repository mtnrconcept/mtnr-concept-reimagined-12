
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

  useEffect(() => {
    // Ajouter des logs détaillés pour déboguer
    console.log('BackgroundVideo montage avec videoUrl:', videoUrl);
    console.log('Video actuelle:', currentVideo);
    console.log('Élément vidéo existe:', !!videoRef.current);
    
    // Vérifier si les fichiers vidéo existent
    const checkVideoFile = async (url: string) => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`Vidéo ${url} accessible:`, response.ok, "status:", response.status);
        if (!response.ok) {
          console.error(`La vidéo ${url} n'est pas accessible. Status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Erreur lors de la vérification de la vidéo ${url}:`, error);
      }
    };
    
    checkVideoFile(videoUrl);
    checkVideoFile(videoUrlUV);
    
    // S'assurer que le corps du document a un fond noir
    document.body.style.backgroundColor = '#000';
    
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [videoUrl, videoUrlUV, currentVideo, videoRef]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
      {/* Fallback image pour les cas où la vidéo ne fonctionne pas */}
      <img 
        src={fallbackImage} 
        alt="Studio background fallback" 
        className="absolute inset-0 min-w-full min-h-full object-cover opacity-30"
        style={{ display: videoError ? 'block' : 'none' }}
      />
      
      {/* Vidéo avec source dynamique */}
      <video
        ref={videoRef}
        className="absolute inset-0 min-w-full min-h-full object-cover"
        playsInline
        muted
        preload="auto"
        style={{ 
          display: videoError ? 'none' : 'block',
          objectFit: 'cover',
          objectPosition: 'center center'
        }}
      >
        <source src={currentVideo} type="video/mp4" />
        <source src={currentVideo} type="video/webm" />
        Votre navigateur ne prend pas en charge les vidéos HTML5.
      </video>
      
      {/* Overlays visuels */}
      <VideoOverlay />
    </div>
  );
};

export default BackgroundVideo;
