
import { useState, useRef, useCallback, useEffect } from 'react';

interface UseBackgroundVideoProps {
  videoUrl: string;
  videoUrlUV?: string;
  uvMode?: boolean;
  isTorchActive?: boolean;
}

export const useBackgroundVideo = (props: UseBackgroundVideoProps) => {
  const { videoUrl, videoUrlUV, uvMode = false, isTorchActive = false } = props;
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(videoUrl || null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  // Mettre à jour la source vidéo en fonction du mode UV
  useEffect(() => {
    if (!videoUrl && !videoUrlUV) {
      setCurrentVideo(null);
      return;
    }
    
    if (isTorchActive && uvMode && videoUrlUV) {
      setCurrentVideo(videoUrlUV);
    } else if (videoUrl) {
      setCurrentVideo(videoUrl);
    } else {
      setCurrentVideo(null);
    }
  }, [isTorchActive, uvMode, videoUrl, videoUrlUV]);

  // Vérifier que la vidéo est chargée
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
    };

    const handleError = (err: Event) => {
      console.error('Erreur lors de la lecture de la vidéo:', err);
      setIsVideoLoaded(false);
      setCurrentVideo(null); // Réinitialiser pour utiliser l'image de secours
    };

    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
    };
  }, [currentVideo]);

  // Fonction pour jouer la transition vidéo
  const playVideoTransition = useCallback(async () => {
    if (isTransitioning || !videoRef.current) return;
    
    setIsTransitioning(true);
    
    try {
      if (videoRef.current) {
        // Réinitialiser la vidéo et démarrer la lecture
        videoRef.current.currentTime = 0;
        await videoRef.current.play();
        
        // Utiliser l'événement de fin de vidéo pour réinitialiser l'état
        videoRef.current.onended = () => {
          setIsTransitioning(false);
        };
      }
    } catch (err) {
      console.error('Erreur lors de la lecture de la vidéo:', err);
      setIsTransitioning(false);
    }
  }, [isTransitioning]);

  return { 
    videoRef, 
    currentVideo, 
    isTransitioning,
    isVideoLoaded, 
    playVideoTransition
  };
};
