
import React, { useEffect } from 'react';
import useBackgroundVideo from '../../hooks/useBackgroundVideo';

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  fallbackImage?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ 
  videoUrl = "/lovable-uploads/Composition_1.mp4", // Remplacé les espaces par des underscores
  videoUrlUV = "/lovable-uploads/Composition_1_1.mp4", // Remplacé les espaces par des underscores
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png"
}) => {
  const {
    videoRef,
    currentVideo,
    fallbackImage: fallbackImg
  } = useBackgroundVideo({
    videoUrl,
    videoUrlUV,
    fallbackImage
  });

  // Ajouter un effet pour aider à déboguer les problèmes vidéo
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleCanPlay = () => {
      console.log('Vidéo prête à être lue:', currentVideo);
    };
    
    const handleError = (e: Event) => {
      console.error('Erreur vidéo détectée:', e);
      console.error('Source de la vidéo:', currentVideo);
    };

    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
    };
  }, [videoRef, currentVideo]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
      {/* Vidéo en fond */}
      <video
        ref={videoRef}
        className="absolute inset-0 min-w-full min-h-full object-cover"
        poster={fallbackImg}
        playsInline
        muted
        preload="auto"
      >
        <source src={currentVideo} type="video/mp4" />
      </video>
      
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
