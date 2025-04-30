
import React, { useEffect, useRef, useState } from 'react';
import { VideoOverlay } from './VideoOverlay';

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  fallbackImage?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ 
  videoUrl = "/lovable-uploads/Video fond normale.mp4", 
  videoUrlUV = "/lovable-uploads/Video fond UV.mp4",
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png"
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // S'assurer que la vidéo est chargée et qu'elle joue correctement
  useEffect(() => {
    if (!videoRef.current) return;
    
    const videoElement = videoRef.current;
    
    // Configuration de la vidéo
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.loop = true;
    videoElement.autoplay = true;
    
    // Charger la vidéo
    videoElement.load();
    
    // Tenter de lire la vidéo
    videoElement.play().catch(error => {
      console.error("Erreur de lecture vidéo:", error);
      setVideoError(true);
    });
    
    // Précharger la vidéo via un lien en tête du document
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = videoUrl;
    link.as = 'video';
    link.type = 'video/mp4';
    document.head.appendChild(link);
    
    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      
      if (videoElement) {
        videoElement.pause();
      }
    };
  }, [videoUrl]);
  
  // Gestion de l'événement de chargement de la vidéo
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    console.log("Vidéo chargée avec succès");
    
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Erreur lors de la lecture après chargement:", err);
        setVideoError(true);
      });
    }
  };

  // Gestion des erreurs de vidéo
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Erreur de chargement vidéo:", e);
    setVideoError(true);
  };

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
      {/* Affichage de l'image de fallback si erreur vidéo */}
      {videoError && (
        <img 
          src={fallbackImage} 
          alt="Background fallback" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.7 }}
        />
      )}
      
      {/* Vidéo d'arrière-plan */}
      <video
        ref={videoRef}
        className="background-video"
        playsInline
        muted
        autoPlay
        loop
        preload="auto"
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
      >
        <source src={videoUrl} type="video/mp4" />
        Votre navigateur ne prend pas en charge les vidéos HTML5.
      </video>
      
      {/* Overlays et effets visuels */}
      <VideoOverlay />
    </div>
  );
};

export default BackgroundVideo;
