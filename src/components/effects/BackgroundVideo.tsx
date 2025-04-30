
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
  const normalVideoRef = useRef<HTMLVideoElement>(null);
  const uvVideoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const { registerVideoTransitionListener, registerVideoRef } = useNavigation();
  const { uvMode } = useUVMode();
  
  // Enregistrer les références de vidéo dans le contexte de navigation
  useEffect(() => {
    if (normalVideoRef.current) {
      registerVideoRef(normalVideoRef, false);
      console.log('Référence vidéo normale enregistrée dans NavigationContext');
    }
    
    if (uvVideoRef.current) {
      registerVideoRef(uvVideoRef, true);
      console.log('Référence vidéo UV enregistrée dans NavigationContext');
    }
  }, [registerVideoRef]);
  
  // Configurer les vidéos au chargement initial
  useEffect(() => {
    const normalVideo = normalVideoRef.current;
    const uvVideo = uvVideoRef.current;
    
    if (normalVideo) {
      normalVideo.muted = true;
      normalVideo.playsInline = true;
      normalVideo.loop = false;
      normalVideo.preload = "auto";
      normalVideo.setAttribute("playsinline", ""); // Double assurance pour iOS
      normalVideo.setAttribute("webkit-playsinline", ""); // Pour WebKit
    }
    
    if (uvVideo) {
      uvVideo.muted = true;
      uvVideo.playsInline = true;
      uvVideo.loop = false;
      uvVideo.preload = "auto";
      uvVideo.setAttribute("playsinline", ""); // Double assurance pour iOS
      uvVideo.setAttribute("webkit-playsinline", ""); // Pour WebKit
    }
    
    console.log('Vidéos configurées au chargement initial');
  }, []);
  
  // S'abonner aux événements de transition
  useEffect(() => {
    const unregister = registerVideoTransitionListener(async () => {
      // Choisir la vidéo selon le mode UV
      const video = uvMode ? uvVideoRef.current : normalVideoRef.current;
      
      if (!video || !document.body.contains(video)) {
        console.warn("Élément vidéo non disponible pour transition");
        return;
      }
      
      try {
        console.log(`🎬 Démarrage transition vidéo ${uvMode ? 'UV' : 'normale'}`);
        
        // Configurer la vidéo pour la transition
        video.loop = false;
        video.currentTime = 0;
        
        // Ajouter la classe pour les effets visuels
        video.classList.add("video-transitioning");
        
        // Lecture avec gestion des erreurs
        try {
          console.log("▶️ Tentative de lecture vidéo");
          await video.play();
          console.log("✅ Vidéo démarrée avec succès pour la transition");
        } catch (error) {
          console.error("❌ Erreur lors de la lecture vidéo pour transition:", error);
          
          // Tentative de récupération - forcer le mode autoplay
          video.muted = true;
          video.playsInline = true;
          video.setAttribute("playsinline", "");
          video.setAttribute("webkit-playsinline", "");
          
          try {
            await video.play();
            console.log("✅ Vidéo démarrée avec succès après récupération");
          } catch (fallbackError) {
            console.error("❌❌ Échec de la récupération:", fallbackError);
          }
        }
      } catch (error) {
        console.error("Erreur générale durant la transition:", error);
      }
    });
    
    return unregister;
  }, [registerVideoTransitionListener, uvMode]);
  
  // Gestion de la fin des vidéos
  useEffect(() => {
    const handleNormalVideoEnded = () => {
      console.log("🏁 Vidéo normale terminée");
      if (normalVideoRef.current) {
        normalVideoRef.current.classList.remove("video-transitioning");
      }
    };
    
    const handleUVVideoEnded = () => {
      console.log("🏁 Vidéo UV terminée");
      if (uvVideoRef.current) {
        uvVideoRef.current.classList.remove("video-transitioning");
      }
    };
    
    if (normalVideoRef.current) {
      normalVideoRef.current.addEventListener('ended', handleNormalVideoEnded);
    }
    
    if (uvVideoRef.current) {
      uvVideoRef.current.addEventListener('ended', handleUVVideoEnded);
    }
    
    return () => {
      if (normalVideoRef.current) {
        normalVideoRef.current.removeEventListener('ended', handleNormalVideoEnded);
      }
      
      if (uvVideoRef.current) {
        uvVideoRef.current.removeEventListener('ended', handleUVVideoEnded);
      }
    };
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
      
      <video
        ref={normalVideoRef}
        className="background-video"
        playsInline
        muted
        preload="auto"
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        style={{ display: uvMode ? 'none' : 'block' }}
      >
        <source src={videoUrl} type="video/mp4" />
        Votre navigateur ne prend pas en charge les vidéos HTML5.
      </video>
      
      <video
        ref={uvVideoRef}
        className="background-video"
        playsInline
        muted
        preload="auto"
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        style={{ display: uvMode ? 'block' : 'none' }}
      >
        <source src={videoUrlUV} type="video/mp4" />
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
