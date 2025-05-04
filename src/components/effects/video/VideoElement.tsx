
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
  // Update the source when uvMode changes
  useEffect(() => {
    if (videoRef.current) {
      const newSrc = uvMode ? videoUrlUV : videoUrl;
      if (videoRef.current.src !== newSrc) {
        videoRef.current.src = newSrc;
        videoRef.current.load();
      }
    }
  }, [uvMode, videoUrl, videoUrlUV, videoRef]);
  
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
        zIndex: uvMode ? 1 : 0, // Augmenter le z-index en mode UV
        opacity: 1 // Assurer une pleine opacité
      }}
    >
      <source src={uvMode ? videoUrlUV : videoUrl} type="video/mp4" />
    </video>
  );
});

VideoElement.displayName = 'VideoElement';

export default VideoElement;
