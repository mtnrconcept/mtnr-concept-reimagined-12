
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
    let ticking = false;
    let lastKnownScrollPosition = 0;
    let lastKnownMouseX = 0;
    let lastKnownMouseY = 0;
    let rafId: number;
    
    const updateVideoPosition = () => {
      if (!videoRef.current) return;
      
      // La vidéo se déplace dans la MÊME direction que le contenu mais plus lentement
      // Le coefficient 0.15 crée un effet de profondeur (vidéo à 15% de la vitesse de défilement)
      // IMPORTANT: Utiliser un nombre positif pour déplacer dans la même direction
      const scrollY = lastKnownScrollPosition;
      const translateY = scrollY * -0.15; // Négatif pour inverser la direction et aller vers le HAUT en scrollant vers le bas
      
      // Ajout d'un léger effet de parallaxe pour les mouvements de souris (réduit)
      const mouseX = lastKnownMouseX * 3; // Effet plus subtil
      const mouseY = lastKnownMouseY * 3;
      
      videoRef.current.style.transform = `translate3d(${mouseX}px, ${translateY}px, 0)`;
      
      ticking = false;
    };
    
    const handleScroll = () => {
      lastKnownScrollPosition = window.scrollY;
      
      if (!ticking) {
        rafId = requestAnimationFrame(updateVideoPosition);
        ticking = true;
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      lastKnownMouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 à 1
      lastKnownMouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 à 1
      
      if (!ticking) {
        rafId = requestAnimationFrame(updateVideoPosition);
        ticking = true;
      }
    };
    
    // Utiliser passive: true pour améliorer les performances
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Exécuter immédiatement pour positionner la vidéo correctement
    updateVideoPosition();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
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
