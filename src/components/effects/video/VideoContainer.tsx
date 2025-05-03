
import React, { useEffect, useRef } from 'react';
import { useVideoStatus } from './hooks/useVideoStatus';
import VideoElement from './VideoElement';
import VideoStatusIndicators from './VideoStatusIndicators';
import VideoOverlayEffects from './VideoOverlayEffects';

interface VideoContainerProps {
  videoUrl?: string;
  videoUrlUV?: string;
}

const VideoContainer: React.FC<VideoContainerProps> = ({ 
  videoUrl = "/lovable-uploads/videonormale.mp4", 
  videoUrlUV = "/lovable-uploads/videouv.mp4"
}) => {
  // Use our custom hook to handle video status and events
  const {
    videoRef,
    loadingStatus,
    videoError,
    isTransitioning,
    uvMode
  } = useVideoStatus(videoUrl, videoUrlUV);
  
  // Effet parallax pour la vidéo lors du défilement
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current || !videoContainerRef.current) return;
      
      // Applique un effet parallax à la vidéo en fonction du défilement
      // Modification: translate positif (même direction, vitesse réduite)
      const scrollY = window.scrollY;
      videoRef.current.style.transform = `translateY(${scrollY * 0.15}px)`; // La vidéo se déplace à 15% de la vitesse de défilement
    };
    
    // Ajoute un effet parallax pour les mouvements de souris
    const handleMouseMove = (e: MouseEvent) => {
      if (!videoRef.current) return;
      
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      
      // Combine l'effet de défilement vertical et de mouvement de souris
      // Maintient le mouvement de la vidéo dans la même direction que le défilement
      const scrollY = window.scrollY;
      videoRef.current.style.transform = `translate3d(${mouseX * -15}px, ${mouseY * -15 + scrollY * 0.15}px, 0)`;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={videoContainerRef} className="fixed inset-0 w-full h-full overflow-hidden z-0 bg-black">
      {/* Status indicators for debug/development */}
      <VideoStatusIndicators 
        loadingStatus={loadingStatus} 
        videoError={videoError} 
        isTransitioning={isTransitioning} 
      />
      
      {/* The actual video element */}
      <VideoElement 
        videoRef={videoRef}
        videoUrl={videoUrl}
        videoUrlUV={videoUrlUV}
        uvMode={uvMode}
      />
      
      {/* Overlay effects (grid and vignette) */}
      <VideoOverlayEffects />
    </div>
  );
};

export default VideoContainer;
