
import { useEffect, useRef, useCallback } from 'react';
import { useNavigation } from '@/components/effects/NavigationContext';
import { useUVMode } from '@/components/effects/UVModeContext';
import { useVideoAvailability } from './useVideoAvailability';
import { useVideoVerification } from './useVideoVerification';
import { useVideoLoad } from './useVideoLoad';

export const useVideoTransition = () => {
  const normalVideoRef = useRef<HTMLVideoElement>(null);
  const uvVideoRef = useRef<HTMLVideoElement>(null);
  const { registerVideoRef, registerVideoTransitionListener } = useNavigation();
  const { uvMode } = useUVMode();
  
  const normalVideoUrl = '/lovable-uploads/Videofondnormale.mp4';
  const uvVideoUrl = '/lovable-uploads/VideofondUV.mp4';
  
  // Use our new separated hooks
  const { videoAvailability, updateAvailabilityStatus } = useVideoAvailability(normalVideoUrl, uvVideoUrl);
  const { verifyAndPrepareVideo } = useVideoVerification();
  
  // Configuration des gestionnaires d'erreur et de chargement
  const { handleVideoLoad, handleVideoError } = useVideoLoad({
    onVideoError: (src) => updateAvailabilityStatus(src, false),
    onVideoLoaded: (src) => updateAvailabilityStatus(src, true)
  });
  
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
    const configureVideo = (video: HTMLVideoElement | null) => {
      if (!video) return;
      
      video.muted = true;
      video.playsInline = true;
      video.loop = false;
      video.preload = "auto";
      video.setAttribute("playsinline", ""); 
      video.setAttribute("webkit-playsinline", "");
    };
    
    configureVideo(normalVideoRef.current);
    configureVideo(uvVideoRef.current);
    
    console.log('Vidéos configurées au chargement initial');
    
    // Tenter de jouer la vidéo dès le montage
    if (uvMode && uvVideoRef.current) {
      uvVideoRef.current.play().catch(e => console.warn("Lecture auto UV impossible:", e));
    } 
    else if (!uvMode && normalVideoRef.current) {
      normalVideoRef.current.play().catch(e => console.warn("Lecture auto normale impossible:", e));
    }
  }, [uvMode]);
  
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
  
  // Subscribe to transition events with improved error handling
  useEffect(() => {
    const unregister = registerVideoTransitionListener(async () => {
      try {
        console.log(`Démarrage de transition vidéo en mode ${uvMode ? 'UV' : 'normal'}`);
        
        // Vérifier que la vidéo est disponible avant de tenter la transition
        const currentVideoUrl = uvMode ? uvVideoUrl : normalVideoUrl;
        const videoRef = uvMode ? uvVideoRef.current : normalVideoRef.current;
        
        const canTransition = await verifyAndPrepareVideo(currentVideoUrl, videoRef);
        if (!canTransition) {
          console.warn("Transition vidéo annulée suite à la vérification");
          return;
        }
        
        // Choisir la vidéo en fonction du mode
        const video = uvMode ? uvVideoRef.current : normalVideoRef.current;
        
        if (!video || !document.body.contains(video)) {
          console.warn("Élément vidéo non disponible pour transition");
          return;
        }
        
        console.log(`🎬 Démarrage transition vidéo ${uvMode ? 'UV' : 'normale'}`);
        
        // Add class for visual effects
        video.classList.add("video-transitioning");
        
        // Reset video and play
        try {
          video.currentTime = 0;
          
          // Solution simple qui fonctionne sur Chrome et autres navigateurs
          setTimeout(async () => {
            try {
              const playPromise = video.play();
              if (playPromise !== undefined) {
                await playPromise;
                console.log("✅ Vidéo démarrée avec succès pour la transition");
              }
            } catch (innerError) {
              console.error("Erreur play():", innerError);
              // Si échec, tenter la lecture avec interaction utilisateur
              document.body.addEventListener('click', function playOnClick() {
                video.play().catch(e => console.warn("Échec de lecture après clic:", e));
                document.body.removeEventListener('click', playOnClick);
              }, { once: true });
            }
          }, 50);
        } catch (error) {
          console.error("❌ Erreur lors de la lecture vidéo:", error);
        }
      } catch (error) {
        console.error("Erreur générale durant la transition:", error);
      }
    });
    
    return unregister;
  }, [registerVideoTransitionListener, uvMode, uvVideoUrl, normalVideoUrl, verifyAndPrepareVideo]);
  
  return { 
    normalVideoRef, 
    uvVideoRef, 
    videoAvailability,
    normalVideoUrl,
    uvVideoUrl,
    handleVideoLoad,
    handleVideoError
  };
};
