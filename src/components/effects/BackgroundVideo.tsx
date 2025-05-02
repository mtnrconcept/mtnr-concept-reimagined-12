
import React, { useEffect, useRef, useState } from 'react';
import { VideoOverlay } from './VideoOverlay';
import { useNavigation } from './NavigationContext';
import { motion } from 'framer-motion';
import { useUVMode } from './UVModeContext';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { registerVideoTransitionListener } = useNavigation();
  const { uvMode } = useUVMode();
  const location = useLocation();
  const currentVideoUrl = uvMode ? videoUrlUV : videoUrl;
  const maxRetries = 3;
  
  // Fonction pour lancer la lecture vidéo avec gestion d'erreur
  const playVideo = async (video: HTMLVideoElement, resetPosition: boolean = true) => {
    try {
      if (resetPosition) {
        video.currentTime = 0;
      }
      
      // Assurer que la vidéo est toujours muette pour permettre l'autoplay
      video.muted = true;
      video.playsInline = true;
      
      // Tentative de lecture
      await video.play();
      console.log("Lecture vidéo démarrée avec succès");
      setVideoError(false);
    } catch (error) {
      console.error("Erreur lors de la lecture vidéo:", error);
      
      // Réessayer après un court délai si nous n'avons pas atteint le nombre maximum de tentatives
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          if (videoRef.current) {
            playVideo(videoRef.current, resetPosition);
          }
        }, 1000);
      } else {
        // Après plusieurs tentatives infructueuses, marquer comme erreur
        setVideoError(true);
      }
    }
  };
  
  // Configurer la vidéo au chargement initial et au changement de page
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleCanPlayThrough = () => {
      console.log("Vidéo entièrement chargée et prête à être jouée");
      setIsVideoLoaded(true);
    };
    
    // Configuration de la vidéo
    video.muted = true;
    video.playsInline = true;
    video.loop = false; // Ne pas boucler automatiquement
    video.autoplay = true; // Tenter l'autoplay
    
    // Mise à jour de la source si nécessaire
    if (video.src !== currentVideoUrl) {
      console.log(`Mise à jour de la source vidéo: ${currentVideoUrl}`);
      video.src = currentVideoUrl;
      video.load();
      
      // Reset retry counter when changing source
      setRetryCount(0);
      
      // Écouter l'événement canplaythrough
      video.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });
    }
    
    // Démarrer la vidéo pour la transition de page
    console.log("Changement de page détecté via useEffect, tentative de lecture vidéo");
    playVideo(video, true);
    
    return () => {
      if (video) {
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
      }
    };
  }, [currentVideoUrl, location.pathname]); // Réagir au changement de pathname
  
  // S'abonner aux événements de transition explicites
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
          await new Promise<void>(resolve => {
            video.onloadeddata = () => resolve();
            video.load();
          });
        }
        
        // Remettre la vidéo au début et la configurer pour la transition
        video.currentTime = 0;
        video.loop = false;
        setRetryCount(0);
        
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
        await playVideo(video, false);
        
        // Nettoyer après la durée de la transition
        setTimeout(() => {
          if (video && document.body.contains(video)) {
            video.classList.remove("video-transitioning");
            console.log("Transition vidéo terminée");
          }
        }, 7000); // Durée exacte de la vidéo
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
    setVideoError(false);
    setRetryCount(0);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Erreur de chargement vidéo:", e);
    // Au lieu de passer immédiatement au fallback, on tente de réessayer
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        if (videoRef.current) {
          videoRef.current.load();
          playVideo(videoRef.current, true);
        }
      }, 1000);
    } else {
      setVideoError(true);
    }
  };
  
  // Gestion de la fin de vidéo
  const handleVideoEnded = () => {
    const video = videoRef.current;
    if (video) {
      console.log("Vidéo terminée naturellement, mise en pause");
      video.pause();
    }
  };

  // Bouton pour recharger la vidéo en cas d'erreur persistante
  const RetryButton = () => {
    if (!videoError) return null;
    
    return (
      <button
        className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-md z-50"
        onClick={() => {
          setVideoError(false);
          setRetryCount(0);
          if (videoRef.current) {
            videoRef.current.load();
            playVideo(videoRef.current, true);
          }
        }}
      >
        Recharger la vidéo
      </button>
    );
  };

  return (
    <motion.div 
      className="fixed inset-0 w-full h-full z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Image de secours si erreur vidéo persistante */}
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
        className={`background-video ${videoError ? 'opacity-0' : 'opacity-100'}`}
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
      
      {/* Bouton de rechargement si erreur */}
      <RetryButton />
      
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
