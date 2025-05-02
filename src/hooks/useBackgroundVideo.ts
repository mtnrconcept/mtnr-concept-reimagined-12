
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUVMode } from '@/components/effects/UVModeContext';
import { useTorch } from '@/components/effects/TorchContext';

interface UseBackgroundVideoProps {
  videoUrl: string;
  videoUrlUV: string;
  fallbackImage?: string;
}

export const useBackgroundVideo = ({ 
  videoUrl, 
  videoUrlUV,
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png"
}: UseBackgroundVideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { uvMode } = useUVMode();
  const { isTorchActive } = useTorch();
  
  // States
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasUserInteraction, setHasUserInteraction] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  // Constants
  const maxRetries = 3;
  const maxLoadAttempts = 5;
  
  // Determine current video URL based on UV mode
  const currentVideo = useMemo(() => {
    // Utiliser des URL sans espaces
    const normalizedVideoUrl = videoUrl.replace(/\s+/g, '-');
    const normalizedVideoUrlUV = videoUrlUV.replace(/\s+/g, '-');
    return uvMode ? normalizedVideoUrlUV : normalizedVideoUrl;
  }, [uvMode, videoUrl, videoUrlUV]);

  // Function to handle user interaction
  const handleUserInteraction = useCallback(() => {
    if (!hasUserInteraction) {
      console.log('User interaction detected, video ready to play');
      setHasUserInteraction(true);
      
      // Attempt to play video after interaction
      if (videoRef.current && !videoError) {
        videoRef.current.play().catch(err => {
          console.warn("Error during initial playback:", err);
          // Être moins sévère sur les erreurs de lecture après interaction utilisateur
          // Ne pas activer setVideoError(true) ici pour donner plus de chances
        });
      }
    }
  }, [hasUserInteraction, videoError]);

  // Function to retry video playback
  const retryVideo = useCallback(() => {
    setVideoError(false);
    setRetryCount(0);
    setLoadAttempts(0);
    
    if (videoRef.current) {
      // Assurer que la vidéo est arrêtée avant de recommencer
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.src = currentVideo;
          videoRef.current.load();
          videoRef.current.play().catch(err => {
            console.warn("Retry attempt failed:", err);
            // Ne pas passer immédiatement à l'image de fallback
          });
        }
      }, 500);
    }
  }, [currentVideo]);

  // Video transition function
  const playVideoTransition = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    try {
      setIsTransitioning(true);
      setIsPlaying(true);
      
      // Réinitialiser la vidéo pour une transition fluide
      videoElement.currentTime = 0;
      
      try {
        await videoElement.play();
        console.log("Transition vidéo démarrée");
        
        // Après la fin de la transition, réactiver la lecture en boucle
        const onEnded = () => {
          videoElement.loop = true;
          setIsTransitioning(false);
          setIsPlaying(false);
          videoElement.removeEventListener('ended', onEnded);
        };
        
        videoElement.addEventListener('ended', onEnded, { once: true });
        
      } catch (error) {
        console.warn("Erreur de lecture pendant la transition:", error);
        setIsTransitioning(false);
        setIsPlaying(false);
        // Tenter à nouveau sans abandonner trop vite
        if (loadAttempts < maxLoadAttempts) {
          setLoadAttempts(prev => prev + 1);
          setTimeout(() => {
            videoElement.play().catch(() => {
              // Silencieux ici
            });
          }, 500);
        }
      }
    } catch (error) {
      console.error("Erreur générale pendant la transition vidéo:", error);
      setIsTransitioning(false);
      setIsPlaying(false);
    }
  }, [loadAttempts, maxLoadAttempts]);

  // Reset retry count when video URL changes
  useEffect(() => {
    setRetryCount(0);
    setLoadAttempts(0);
  }, [currentVideo]);
  
  // Initial video setup
  useEffect(() => {
    if (videoRef.current && !videoError) {
      const autoplayAttempt = async () => {
        try {
          // S'assurer que la source est correctement définie
          if (videoRef.current) {
            videoRef.current.src = currentVideo;
            videoRef.current.load();
            await videoRef.current.play();
            console.log("Lecture automatique réussie");
          }
        } catch (error) {
          console.warn("Lecture automatique échouée, attente d'interaction:", error);
          // Ne pas passer directement à l'image de fallback
        }
      };
      
      autoplayAttempt();
    }
  }, [currentVideo, videoError]);

  return {
    videoRef,
    isFirstLoad,
    setIsFirstLoad,
    isTransitioning,
    setIsTransitioning,
    hasUserInteraction,
    setHasUserInteraction,
    currentVideo,
    handleUserInteraction,
    playVideoTransition,
    uvMode,
    isTorchActive,
    videoError,
    setVideoError,
    isPlaying,
    retryVideo,
    fallbackImage
  };
};
