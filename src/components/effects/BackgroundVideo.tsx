
import React, { useEffect, useRef, useState } from 'react';
import { VideoOverlay } from './VideoOverlay';
import { useNavigation } from './NavigationContext';
import { motion } from 'framer-motion';
import { useUVMode } from './UVModeContext';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const { registerVideoTransitionListener } = useNavigation();
  const { uvMode } = useUVMode();
  const currentVideoUrl = uvMode ? videoUrlUV : videoUrl;
  
  // Configurer la vidéo au chargement initial
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleCanPlayThrough = () => {
      console.log("Vidéo entièrement chargée et prête à être jouée");
      setIsVideoLoaded(true);
    };
    
    // Configuration initiale de la vidéo
    video.muted = true;
    video.playsInline = true;
    video.loop = false;
    video.autoplay = false;
    
    // S'assurer que la vidéo est initialement en pause
    video.pause();
    video.currentTime = 0;
    
    // Si la source a changé (UV mode toggle), mettre à jour
    if (video.src !== currentVideoUrl) {
      console.log(`Mise à jour de la source vidéo: ${currentVideoUrl}`);
      video.src = currentVideoUrl;
      video.load();
      
      // Écouter l'événement canplaythrough
      video.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });
    }
    
    return () => {
      if (video) {
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
      }
    };
  }, [currentVideoUrl]);
  
  // S'abonner aux événements de transition
  useEffect(() => {
    const unregister = registerVideoTransitionListener(async () => {
      const video = videoRef.current;
      if (!video) {
        console.warn("Élément vidéo non disponible pour transition");
        return;
      }
      
      try {
        console.log("Démarrage transition vidéo - remise à zéro et lecture");
        
        // Ajouter la classe pour les effets visuels
        video.classList.add("video-transitioning");
        
        // Assurez-vous que la source vidéo est correctement définie
        if (!video.src || video.src !== currentVideoUrl) {
          video.src = currentVideoUrl;
          await new Promise(resolve => {
            video.onloadeddata = () => resolve(true);
            video.load();
          });
        }
        
        // Remettre la vidéo au début
        video.currentTime = 0;
        video.loop = false;
        
        // Gérer la fin de la vidéo
        const handleVideoEnded = () => {
          console.log("Vidéo terminée, mise en pause");
          video.pause();
          video.removeEventListener('ended', handleVideoEnded);
        };
        
        // Nettoyer tout gestionnaire existant et ajouter le nouveau
        video.removeEventListener('ended', handleVideoEnded);
        video.addEventListener('ended', handleVideoEnded, { once: true });
        
        // Lecture avec gestion des erreurs
        try {
          await video.play();
          console.log("La vidéo a démarré avec succès pour la transition");
        } catch (error) {
          console.error("Erreur lors de la lecture vidéo pour transition:", error);
          // Réessayer après un court délai
          setTimeout(async () => {
            try {
              await video.play();
              console.log("Seconde tentative de lecture réussie");
            } catch (retryError) {
              console.error("La seconde tentative de lecture a également échoué:", retryError);
            }
          }, 100);
        }
        
        // Nettoyer après la durée de la transition
        setTimeout(() => {
          if (video && document.body.contains(video)) {
            video.classList.remove("video-transitioning");
            console.log("Transition vidéo terminée");
          }
        }, 7000);
      } catch (error) {
        console.error("Erreur générale durant la transition:", error);
      }
    });
    
    return unregister;
  }, [registerVideoTransitionListener, currentVideoUrl]);
  
  // Gestion des événements vidéo
  const handleVideoLoad = () => {
    console.log("Vidéo fond chargée avec succès");
    setIsVideoLoaded(true);
    
    // Précharger la vidéo
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Erreur de chargement vidéo:", e);
    setVideoError(true);
  };
  
  // Gestion de la fin de vidéo
  const handleVideoEnded = () => {
    const video = videoRef.current;
    if (video) {
      console.log("Vidéo terminée naturellement, mise en pause");
      video.pause();
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 w-full h-full z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Image de secours si erreur vidéo */}
      {videoError && (
        <img 
          src={fallbackImage} 
          alt="Background fallback" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Vidéo d'arrière-plan */}
      <video
        ref={videoRef}
        className="background-video"
        playsInline
        muted
        preload="auto"
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onEnded={handleVideoEnded}
      >
        <source src={currentVideoUrl} type="video/mp4" />
        Votre navigateur ne prend pas en charge les vidéos HTML5.
      </video>
      
      {/* Superposition pour effets spéciaux */}
      <VideoOverlay />
      
      {/* Éléments décoratifs parallax */}
      <motion.div 
        className="absolute top-[10%] right-[10%] w-32 h-32 rounded-full bg-yellow-400 opacity-30 blur-lg"
        animate={{ 
          x: [0, 10, -10, 0],
          y: [0, -10, 10, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut"
        }}
        style={{ zIndex: 1, filter: "blur(40px)" }}
      />
      
      <motion.div 
        className="absolute bottom-[15%] left-[15%] w-40 h-40 rounded-full bg-yellow-500 opacity-20 blur-xl"
        animate={{ 
          x: [0, -15, 15, 0],
          y: [0, 15, -15, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 25,
          ease: "easeInOut"
        }}
        style={{ zIndex: 1, filter: "blur(50px)" }}
      />
    </motion.div>
  );
};

export default BackgroundVideo;
