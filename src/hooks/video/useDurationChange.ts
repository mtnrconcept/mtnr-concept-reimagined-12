
import { useEffect, useCallback } from "react";

interface UseDurationChangeProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function useDurationChange({ videoRef }: UseDurationChangeProps) {
  const handleVideoDurationChange = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    console.log(`Durée de la vidéo modifiée: ${videoElement.duration}`);
    
    // Ajustements pour les vidéos très courtes ou très longues
    if (videoElement.duration < 1.5) {
      videoElement.playbackRate = 0.75; // Ralentir pour les très courtes
      console.log('Vidéo courte détectée, lecture ralentie');
    } else if (videoElement.duration > 10) {
      videoElement.playbackRate = 1.25; // Accélérer pour les trop longues
      console.log('Vidéo longue détectée, lecture accélérée');
    }
  }, [videoRef]);
  
  // Ajouter un listener pour le changement de durée
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    videoElement.addEventListener('durationchange', handleVideoDurationChange);
    return () => {
      videoElement.removeEventListener('durationchange', handleVideoDurationChange);
    };
  }, [videoRef, handleVideoDurationChange]);
  
  return { handleVideoDurationChange };
}
