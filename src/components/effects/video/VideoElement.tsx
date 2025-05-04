
import React, { memo } from 'react';

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
        transformStyle: 'preserve-3d'
      }}
    >
      <source src={currentVideoUrl} type="video/mp4" />
    </video>
  );
});

VideoElement.displayName = 'VideoElement';

export default VideoElement;
