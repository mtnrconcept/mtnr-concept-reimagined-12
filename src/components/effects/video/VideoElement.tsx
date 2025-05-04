
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
      // S'assurer que l'élément vidéo est visible avec une z-index élevée en mode UV
      videoRef.current.style.opacity = "1";
      videoRef.current.style.visibility = "visible";
      videoRef.current.style.zIndex = uvMode ? "5" : "0"; // Augmenter le z-index en mode UV
      videoRef.current.load();
      
      // Tenter la lecture automatique
      videoRef.current.play()
        .then(() => console.log("Lecture vidéo démarrée"))
        .catch(err => console.log("Lecture auto non autorisée", err));
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
        zIndex: uvMode ? 5 : 0  // Augmenter le z-index en mode UV
      }}
    >
      <source src={currentVideoUrl} type="video/mp4" />
    </video>
  );
});

VideoElement.displayName = 'VideoElement';

export default VideoElement;
