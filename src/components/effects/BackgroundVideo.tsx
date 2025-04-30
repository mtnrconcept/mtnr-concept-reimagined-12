
import React, { useEffect, useRef } from 'react';

interface BackgroundVideoProps {
  videoUrl?: string;
  fallbackImage?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ 
  videoUrl = "/lovable-uploads/staircase-video.mp4", 
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const playVideo = async () => {
      try {
        await videoElement.play();
        videoElement.playbackRate = 0.6; // Ralentir légèrement pour un effet plus dramatique
        console.log('Vidéo en lecture');
      } catch (error) {
        console.error('Erreur lors de la lecture de la vidéo:', error);
      }
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        videoElement.pause();
      } else {
        playVideo();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    playVideo();
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
      {/* Vidéo en fond */}
      <video
        ref={videoRef}
        className="absolute inset-0 min-w-full min-h-full object-cover"
        poster={fallbackImage}
        playsInline
        autoPlay
        loop
        muted
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      
      {/* Overlay pour assombrir légèrement la vidéo */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      
      {/* Grille */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.15) 1px, transparent 1px)',
          backgroundSize: '35px 35px', 
          transform: 'translateZ(-50px)',
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default BackgroundVideo;
