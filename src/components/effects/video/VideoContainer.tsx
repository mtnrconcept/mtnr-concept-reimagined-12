
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
  
  // Référence pour le conteneur vidéo
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  // Optimisation du parallaxe pour éviter les saccades
  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current || !videoContainerRef.current) return;
      
      // La vidéo se déplace dans la même direction que le contenu mais plus lentement
      // Le coefficient 0.2 crée un effet de profondeur subtil (20% de la vitesse de défilement)
      const scrollY = window.scrollY;
      videoRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
    };
    
    // Optimisation des performances avec requestAnimationFrame
    let ticking = false;
    let lastKnownScrollPosition = 0;
    
    const onScroll = () => {
      lastKnownScrollPosition = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    // Ajoute un effet parallax pour les mouvements de souris (très léger)
    const handleMouseMove = (e: MouseEvent) => {
      if (!videoRef.current) return;
      
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      
      // Combine l'effet de défilement vertical et de mouvement de souris
      const scrollY = window.scrollY;
      videoRef.current.style.transform = `translate3d(${mouseX * -2}px, ${scrollY * 0.2 + mouseY * -2}px, 0)`;
    };
    
    // Utiliser passive: true pour améliorer les performances
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
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
