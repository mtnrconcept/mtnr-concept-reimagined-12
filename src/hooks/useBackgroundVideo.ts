import { useState, useRef, useCallback, useEffect } from 'react';

interface UseBackgroundVideoProps {
  videoUrl: string;
  videoUrlUV: string;
  uvMode?: boolean;
  isTorchActive?: boolean;
}

export const useBackgroundVideo = (props: UseBackgroundVideoProps) => {
  const { videoUrl, videoUrlUV, uvMode = false, isTorchActive = false } = props;
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState(videoUrl);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Mettre à jour la source vidéo en fonction du mode UV
  useEffect(() => {
    if (isTorchActive && uvMode) {
      setCurrentVideo(videoUrlUV);
    } else {
      setCurrentVideo(videoUrl);
    }
  }, [isTorchActive, uvMode, videoUrl, videoUrlUV]);

  // Fonction pour jouer la transition vidéo
  const playVideoTransition = useCallback(async () => {
    if (isTransitioning) return;
    
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
    playVideoTransition
  };
};
