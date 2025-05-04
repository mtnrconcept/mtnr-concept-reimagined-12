
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
  videoUrl = "/lovable-uploads/videonormale.mp4",
  videoUrlUV = "/lovable-uploads/videouv.mp4",
  className = ""
}: BackgroundVideoProps) {
  const location = useLocation();
  
  // Effet pour défiler vers le haut à chaque changement de page
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto' // Utilise 'auto' au lieu de 'smooth' pour un défilement instantané
    });
  }, [location.pathname]);
  
  return (
    <VideoContainer 
      videoUrl={videoUrl}
      videoUrlUV={videoUrlUV}
    />
  );
}
