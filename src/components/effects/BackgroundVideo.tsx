
import React, { useEffect, useRef, useState } from 'react';
import { VideoOverlay } from './VideoOverlay';
import { useNavigation } from './NavigationContext';
import { useLocation } from 'react-router-dom';

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
  const { isTransitioning: navTransitioning } = useNavigation();
  const location = useLocation();
  
  // Déclencher la transition vidéo lors des changements de page
  useEffect(() => {
    if (!videoRef.current) return;
    
    console.log("Changement de page détecté, démarrage transition vidéo");
    setIsTransitioning(true);
    
    const performTransition = async () => {
      try {
        // Réinitialiser la vidéo pour la transition
        videoRef.current!.currentTime = 0;
        
        // Ajuster les effets visuels pendant la transition
        videoRef.current!.style.filter = "brightness(1.2)";
        
        // Ajouter la classe de transition
        videoRef.current!.classList.add("video-transitioning");
        
        // Lancer la lecture de la vidéo depuis le début
        await videoRef.current!.play();
        
        // Attendre que la vidéo se termine (une seule fois pour la transition)
        const handleVideoEnd = () => {
          console.log("Transition vidéo terminée");
          setIsTransitioning(false);
          
          // Restaurer l'apparence normale
          videoRef.current!.style.filter = "";
          videoRef.current!.classList.remove("video-transitioning");
          
          // Supprimer l'écouteur après utilisation
          videoRef.current!.removeEventListener('ended', handleVideoEnd);
          
          // Redémarrer la lecture en boucle
          videoRef.current!.currentTime = 0;
          videoRef.current!.play().catch(err => console.error("Erreur lors du redémarrage après transition:", err));
        };
        
        // Écouter la fin de la vidéo pour terminer la transition
        videoRef.current!.addEventListener('ended', handleVideoEnd, { once: true });
        
      } catch (error) {
        console.error("Erreur lors de la transition vidéo:", error);
        setIsTransitioning(false);
      }
    };
    
    performTransition();
  }, [location.pathname]);
  
  // Configuration initiale de la vidéo
  useEffect(() => {
    if (!videoRef.current) return;
    
    const videoElement = videoRef.current;
    
    // Configuration de la vidéo
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.loop = true;
    videoElement.autoplay = true;
    
    // Essayer de jouer la vidéo au chargement initial
    const playVideo = async () => {
      try {
        await videoElement.play();
        console.log("Lecture initiale de la vidéo réussie");
      } catch (error) {
        console.error("Erreur de lecture initiale:", error);
        
        // En cas d'échec, essayez à nouveau lors de la première interaction utilisateur
        const resumePlayback = async () => {
          try {
            await videoElement.play();
            document.removeEventListener('click', resumePlayback);
          } catch (err) {
            console.error("Échec de reprise de la lecture:", err);
          }
        };
        
        document.addEventListener('click', resumePlayback, { once: true });
      }
    };
    
    playVideo();
    
    // Précharger la vidéo
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
        videoElement.src = "";
        videoElement.load();
      }
    };
  }, [videoUrl]);
  
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
