
import React, { forwardRef, useState, useEffect } from 'react';

interface VideoElementProps {
  className: string;
  src: string;
  onLoadedData?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onEnded?: () => void;
  autoRetry?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
}

const VideoElement = forwardRef<HTMLVideoElement, VideoElementProps>(({
  className,
  src,
  onLoadedData,
  onError,
  onEnded,
  autoRetry = true,
  preload = 'auto'
}, ref) => {
  const [retryCount, setRetryCount] = useState(0);
  const [videoSource, setVideoSource] = useState(src);
  
  // Reset retry count when source changes
  useEffect(() => {
    setRetryCount(0);
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
        
        // Ne pas utiliser load() - simplement réinitialiser la source via React
        setVideoSource('');
        setTimeout(() => setVideoSource(src), 10);
      }, retryDelay);
    }
  };
  
  // Note: On utilise un key dynamique pour forcer le remontage complet
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
