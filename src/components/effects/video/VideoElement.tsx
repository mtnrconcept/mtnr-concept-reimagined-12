
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
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-0"
      playsInline
      muted
      preload="auto"
      style={{
        // Suppression des styles de transition pour éliminer la latence
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      <source src={uvMode ? videoUrlUV : videoUrl} type="video/mp4" />
    </video>
  );
};

export default VideoElement;
