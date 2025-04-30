
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
  const { registerVideoTransitionListener, registerVideoRef } = useNavigation();
  const { uvMode } = useUVMode();
  
  // Enregistrer la référence de la vidéo dans le contexte de navigation
  useEffect(() => {
    if (videoRef.current) {
      registerVideoRef(videoRef);
      console.log('Référence vidéo enregistrée dans NavigationContext');
    }
  }, [registerVideoRef]);
  
  // Configurer la vidéo au chargement initial
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = true;
    video.playsInline = true;
    video.loop = false; // Important: ne pas mettre en boucle pour les transitions
    video.preload = "auto";
    
    const attemptAutoplay = async () => {
      try {
        // Lors du premier chargement, on peut laisser la vidéo en pause
        console.log('Vidéo configurée au chargement initial');
      } catch (err) {
        console.warn('Erreur de configuration initiale:', err);
      }
    };
    
    attemptAutoplay();
  }, []);
  
  // S'abonner aux événements de transition
  useEffect(() => {
    const unregister = registerVideoTransitionListener(async () => {
      const video = videoRef.current;
      if (!video || !document.body.contains(video)) {
        console.warn("Élément vidéo non disponible pour transition");
        return;
      }
      
      try {
        console.log("🎬 Démarrage transition vidéo - remise à zéro");
        
        // Utiliser la bonne source vidéo selon le mode UV
        const currentSource = uvMode ? videoUrlUV : videoUrl;
        if (video.src !== currentSource) {
          video.src = currentSource;
          video.load();
        }
        
        // Configurer la vidéo pour la transition
        video.loop = false;
        video.currentTime = 0;
        
        // Ajouter la classe pour les effets visuels
        video.classList.add("video-transitioning");
        
        // Lecture avec gestion des erreurs
        try {
          console.log("▶️ Tentative de lecture vidéo");
          const playPromise = video.play();
          if (playPromise !== undefined) {
            await playPromise;
            console.log("✅ Vidéo démarrée avec succès pour la transition");
          }
        } catch (error) {
          console.error("❌ Erreur lors de la lecture vidéo pour transition:", error);
        }
      } catch (error) {
        console.error("Erreur générale durant la transition:", error);
      }
    });
    
    return unregister;
  }, [registerVideoTransitionListener, uvMode, videoUrl, videoUrlUV]);
  
  // Gestion de la fin de la vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      console.log("🏁 Vidéo terminée");
      video.classList.remove("video-transitioning");
      
      // Remettre en boucle pour l'état normal
      video.loop = true;
      
      // Relancer la vidéo en boucle
      video.play().catch(e => console.warn("Erreur lors de la reprise en boucle:", e));
    };
    
    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, []);
  
  // Gestion des événements vidéo
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    console.log("Vidéo fond chargée avec succès");
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Erreur de chargement vidéo:", e);
    setVideoError(true);
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
        autoPlay
        preload="auto"
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
      >
        <source src={uvMode ? videoUrlUV : videoUrl} type="video/mp4" />
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
