
import React from 'react';

interface VideoElementProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoUrl: string;
  videoUrlUV: string;
  uvMode: boolean;
}

const VideoElement: React.FC<VideoElementProps> = ({ 
  videoRef, 
  videoUrl, 
  videoUrlUV, 
  uvMode 
}) => {
  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      playsInline
      muted
      preload="auto"
      style={{
        // Optimisation des performances
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
        transformStyle: 'preserve-3d'
      }}
    >
      <source src={uvMode ? videoUrlUV : videoUrl} type="video/mp4" />
    </video>
  );
};

export default VideoElement;
