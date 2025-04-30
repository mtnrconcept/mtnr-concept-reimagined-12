
import React, { forwardRef, useState, useEffect } from 'react';

interface VideoElementProps {
  className: string;
  src: string;
  onLoadedData?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onEnded?: () => void;
  autoRetry?: boolean;
  fallbackImage?: string;
  preload?: 'none' | 'metadata' | 'auto';
}

const VideoElement = forwardRef<HTMLVideoElement, VideoElementProps>(({
  className,
  src,
  onLoadedData,
  onError,
  onEnded,
  autoRetry = true,
  fallbackImage,
  preload = 'auto'
}, ref) => {
  const [retryCount, setRetryCount] = useState(0);
  const [showFallback, setShowFallback] = useState(false);
  const [videoSource, setVideoSource] = useState(src);
  
  // Reset retry count and fallback state when source changes
  useEffect(() => {
    setRetryCount(0);
    setShowFallback(false);
    setVideoSource(src);
  }, [src]);
  
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error(`Erreur vidéo pour ${src} - Tentative ${retryCount + 1}/3`);
    
    if (onError) {
      onError(e);
    }
    
    if (autoRetry && retryCount < 2) {
      // Attendre un peu avant chaque nouvelle tentative
      const retryDelay = Math.min(1000 * (retryCount + 1), 3000);
      
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        
        // Au lieu d'utiliser .load() directement, on réinitialise la source
        const videoElement = e.target as HTMLVideoElement;
        if (videoElement && videoElement.canPlayType) {
          // Chrome workaround: éviter d'appeler load() directement
          // Réinitialiser le src via l'état pour forcer React à recréer l'élément
          setVideoSource('');
          setTimeout(() => setVideoSource(src), 10);
        }
      }, retryDelay);
    } else {
      // Après 3 tentatives, montrer l'image de fallback si disponible
      if (fallbackImage) {
        setShowFallback(true);
      }
    }
  };
  
  // Afficher l'image de fallback si les tentatives échouent
  if (showFallback && fallbackImage) {
    return (
      <img 
        src={fallbackImage} 
        alt="Background fallback" 
        className={className}
      />
    );
  }
  
  // Note: On utilise un key dynamique pour forcer le remontage complet
  // plutôt que d'appeler .load()
  return (
    <video
      ref={ref}
      key={`video-${retryCount}-${videoSource}`}
      className={className}
      playsInline
      muted
      preload={preload}
      onLoadedData={onLoadedData}
      onError={handleError}
      onEnded={onEnded}
    >
      {videoSource && <source src={videoSource} type="video/mp4" />}
      Votre navigateur ne prend pas en charge les vidéos HTML5.
    </video>
  );
});

VideoElement.displayName = 'VideoElement';

export default VideoElement;
