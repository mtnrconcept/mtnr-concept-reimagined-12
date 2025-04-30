
import { useEffect, useRef } from 'react';
import { useNavigation } from '@/components/effects/NavigationContext';
import { useUVMode } from '@/components/effects/UVModeContext';

export const useVideoTransition = () => {
  const normalVideoRef = useRef<HTMLVideoElement>(null);
  const uvVideoRef = useRef<HTMLVideoElement>(null);
  const { registerVideoRef, registerVideoTransitionListener } = useNavigation();
  const { uvMode } = useUVMode();
  
  // Register video refs in NavigationContext
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
  
  // Set up initial video configurations
  useEffect(() => {
    const normalVideo = normalVideoRef.current;
    const uvVideo = uvVideoRef.current;
    
    const configureVideo = (video: HTMLVideoElement | null) => {
      if (!video) return;
      
      video.muted = true;
      video.playsInline = true;
      video.loop = false;
      video.preload = "auto";
      video.setAttribute("playsinline", ""); 
      video.setAttribute("webkit-playsinline", "");
    };
    
    configureVideo(normalVideo);
    configureVideo(uvVideo);
    
    console.log('Vidéos configurées au chargement initial');
  }, []);
  
  // Handle video ended events
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
  
  // Subscribe to transition events
  useEffect(() => {
    const unregister = registerVideoTransitionListener(async () => {
      // Choose video based on UV mode
      const video = uvMode ? uvVideoRef.current : normalVideoRef.current;
      
      if (!video || !document.body.contains(video)) {
        console.warn("Élément vidéo non disponible pour transition");
        return;
      }
      
      try {
        console.log(`🎬 Démarrage transition vidéo ${uvMode ? 'UV' : 'normale'}`);
        
        // Set up video for transition
        video.loop = false;
        video.currentTime = 0;
        
        // Add class for visual effects
        video.classList.add("video-transitioning");
        
        // Play with error handling
        try {
          console.log("▶️ Tentative de lecture vidéo");
          await video.play();
          console.log("✅ Vidéo démarrée avec succès pour la transition");
        } catch (error) {
          console.error("❌ Erreur lors de la lecture vidéo pour transition:", error);
          
          // Recovery attempt - force autoplay mode
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
  
  return { normalVideoRef, uvVideoRef };
};
