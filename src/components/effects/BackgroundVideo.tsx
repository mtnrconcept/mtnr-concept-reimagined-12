
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VideoContainer from './video/VideoContainer';
import { useUVMode } from './UVModeContext';

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  className?: string;
}

export default function BackgroundVideo({ 
  videoUrl = "/lovable-uploads/video-fond-normale.mp4",
  videoUrlUV = "/lovable-uploads/video-fond-uv.mp4",
  className = ""
}: BackgroundVideoProps) {
  const location = useLocation();
  
  // Effet pour défiler vers le haut à chaque changement de page
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto' // Utilise 'auto' au lieu de 'smooth' pour un défilement instantané
    });
    
    // Définir une durée fixe de transition vidéo de 7000ms (7 secondes)
    window.videoTransitionDuration = 7000;
    
    // Communiquer cette durée à travers une variable globale pour que d'autres composants puissent la synchroniser
    if (typeof window !== 'undefined') {
      window.videoTransitionDuration = 7000;
    }
  }, [location.pathname]);
  
  return (
    <VideoContainer 
      videoUrl={videoUrl}
      videoUrlUV={videoUrlUV}
    />
  );
}
