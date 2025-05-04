
import React, { memo, useEffect } from 'react';

interface VideoElementProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoUrl: string;
  videoUrlUV: string;
  uvMode: boolean;
}

const VideoElement: React.FC<VideoElementProps> = memo(({ 
  videoRef, 
  videoUrl, 
  videoUrlUV, 
  uvMode 
}) => {
  // La source est calculée directement dans l'attribut pour éviter un re-render
  const currentVideoUrl = uvMode ? videoUrlUV : videoUrl;
  
  // Effect pour recharger la vidéo quand l'URL change
  useEffect(() => {
    if (videoRef.current) {
      console.log(`Chargement de la vidéo: ${currentVideoUrl}, Mode UV: ${uvMode ? 'activé' : 'désactivé'}`);
      // S'assurer que l'élément vidéo est visible
      videoRef.current.style.opacity = "1";
      videoRef.current.style.visibility = "visible";
      videoRef.current.style.zIndex = "0"; 
      videoRef.current.load();
    }
  }, [currentVideoUrl, videoRef, uvMode]);
  
  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      playsInline
      muted
      preload="auto"
      style={{
        transform: 'translate3d(0, 0, 0) scale(1.1)',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        opacity: 1,
        visibility: 'visible',
        zIndex: 0
      }}
    >
      <source src={currentVideoUrl} type="video/mp4" />
    </video>
  );
});

VideoElement.displayName = 'VideoElement';

export default VideoElement;
