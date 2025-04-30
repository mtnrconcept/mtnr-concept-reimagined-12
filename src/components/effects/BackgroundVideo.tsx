
import React, { useEffect, useRef, useState } from 'react';
import { VideoOverlay } from './VideoOverlay';
import { useNavigation } from './NavigationContext';

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isTransitioning: navTransitioning, registerVideoTransitionListener } = useNavigation();
  
  // Gérer les transitions de vidéo lors des événements de navigation
  useEffect(() => {
    if (!videoRef.current) return;
    
    const handleTransition = async () => {
      try {
        console.log("Démarrage transition vidéo");
        setIsTransitioning(true);
        
        const videoElement = videoRef.current;
        if (!videoElement || !document.body.contains(videoElement)) {
          console.warn("Élément vidéo non disponible pour transition");
          return;
        }
        
        // Appliquer les effets visuels pendant la transition
        videoElement.style.filter = "brightness(1.2)";
        videoElement.classList.add("video-transitioning");
        
        // Réinitialiser la lecture vidéo
        videoElement.currentTime = 0;
        
        try {
          // Tenter de lire la vidéo après s'être assuré qu'elle est prête
          const playPromise = videoElement.play();
          if (playPromise !== undefined) {
            await playPromise;
            console.log("La vidéo a commencé sa lecture pour la transition");
          }
        } catch (error) {
          console.error("Erreur lors de la lecture de la vidéo pour transition:", error);
        }
        
        // Attendre la fin de la transition (basé sur la durée de la vidéo)
        setTimeout(() => {
          if (videoElement && document.body.contains(videoElement)) {
            videoElement.style.filter = "";
            videoElement.classList.remove("video-transitioning");
            setIsTransitioning(false);
            console.log("Transition vidéo terminée");
          }
        }, 2500); // Durée approximative de la vidéo
      } catch (error) {
        console.error("Erreur lors de la transition vidéo:", error);
        setIsTransitioning(false);
      }
    };
    
    // S'inscrire pour recevoir les notifications de transition
    const unregister = registerVideoTransitionListener(handleTransition);
    
    return () => {
      unregister();
    };
  }, [registerVideoTransitionListener]);
  
  // Configuration initiale et préchargement de la vidéo
  useEffect(() => {
    if (!videoRef.current) return;
    
    const videoElement = videoRef.current;
    
    // Configuration de la vidéo
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.loop = true;
    videoElement.autoplay = true;
    
    // Précharger la vidéo
    videoElement.preload = "auto";
    
    // Ne pas utiliser de link preload en parallèle - peut causer des chargements doubles
    
    // Initialiser la lecture quand la vidéo est prête
    const handleCanPlay = () => {
      if (!isTransitioning && videoElement && document.body.contains(videoElement)) {
        videoElement.play().catch(error => {
          console.warn("Erreur lors de la lecture initiale:", error);
        });
      }
    };
    
    videoElement.addEventListener('canplay', handleCanPlay);
    
    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      
      // Nettoyage propre
      if (document.body.contains(videoElement)) {
        videoElement.pause();
        videoElement.src = "";
        videoElement.load();
      }
    };
  }, [videoUrl, isTransitioning]);
  
  // Gestion de l'événement de chargement de la vidéo
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    console.log("Vidéo chargée avec succès");
  };

  // Gestion des erreurs de vidéo
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Erreur de chargement vidéo:", e);
    setVideoError(true);
  };

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
      {/* Fallback si erreur vidéo */}
      {videoError && (
        <img 
          src={fallbackImage} 
          alt="Background fallback" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.7 }}
        />
      )}
      
      {/* Vidéo d'arrière-plan unique */}
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
