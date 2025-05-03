
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
      
      // La vidéo se déplace dans la MÊME direction que le contenu
      // mais légèrement plus lentement pour créer l'effet de profondeur
      const scrollY = window.scrollY;
      videoRef.current.style.transform = `translateY(${-scrollY * 0.85}px)`; 
    };
    
    // Ajoute un effet parallax pour les mouvements de souris (très léger)
    const handleMouseMove = (e: MouseEvent) => {
      if (!videoRef.current) return;
      
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      
      // Combine l'effet de défilement vertical et de mouvement de souris
      const scrollY = window.scrollY;
      videoRef.current.style.transform = `translate3d(${mouseX * -5}px, ${-scrollY * 0.85 + mouseY * -5}px, 0)`;
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
