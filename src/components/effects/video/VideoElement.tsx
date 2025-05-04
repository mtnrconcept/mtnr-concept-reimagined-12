
import React, { memo, useEffect, useState } from 'react';

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
  const [isLoaded, setIsLoaded] = useState(false);

  // Update the source when uvMode changes
  useEffect(() => {
    if (videoRef.current) {
      const newSrc = uvMode ? videoUrlUV : videoUrl;
      if (videoRef.current.src !== newSrc) {
        videoRef.current.src = newSrc;
        videoRef.current.load();
        setIsLoaded(false);
        
        // Déclencher la lecture après un court délai
        const timer = setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play()
              .catch(err => console.warn('Lecture vidéo automatique impossible:', err));
          }
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, [uvMode, videoUrl, videoUrlUV, videoRef]);
  
  // Gérer l'événement canplay pour marquer la vidéo comme chargée
  const handleCanPlay = () => {
    setIsLoaded(true);
    console.log("Vidéo prête à être lue:", videoRef.current?.src);
  };
  
  return (
    <video
      ref={videoRef}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-50'}`}
      playsInline
      muted
      autoPlay
      loop
      preload="auto"
      onCanPlay={handleCanPlay}
      style={{
        transform: 'translate3d(0, 0, 0) scale(1.1)',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        zIndex: uvMode ? 5 : 0, // Augmenter le z-index en mode UV
        opacity: 1 // Assurer une pleine opacité
      }}
    >
      <source src={uvMode ? videoUrlUV : videoUrl} type="video/mp4" />
    </video>
  );
});

VideoElement.displayName = 'VideoElement';

export default VideoElement;
