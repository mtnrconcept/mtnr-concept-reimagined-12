
import { useCallback, useEffect } from 'react';
import { RefObject } from 'react';

interface UseVideoInteractionProps {
  videoRef: RefObject<HTMLVideoElement>;
  hasUserInteraction: boolean;
  setHasUserInteraction: (value: boolean) => void;
  videoError: boolean;
}

export const useVideoInteraction = ({
  videoRef,
  hasUserInteraction,
  setHasUserInteraction,
  videoError
}: UseVideoInteractionProps) => {
  
  // Fonction pour gérer la première interaction utilisateur
  const handleUserInteraction = useCallback(() => {
    if (!hasUserInteraction) {
      console.log('User interaction detected, video ready to play');
      setHasUserInteraction(true);
      
      // Tentative de lecture vidéo après interaction
      if (videoRef.current && !videoError) {
        videoRef.current.play().catch(err => {
          console.error("Error during playback after interaction:", err);
        });
      }
    }
  }, [hasUserInteraction, videoError, videoRef, setHasUserInteraction]);

  // Ajouter des écouteurs pour la première interaction utilisateur
  useEffect(() => {
    if (hasUserInteraction) return;
    
    const handleInteraction = () => {
      handleUserInteraction();
    };
    
    // Ajout d'écouteurs d'événements
    const events = ['click', 'touchstart', 'keydown', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true });
    });
    
    return () => {
      // Nettoyage des écouteurs
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [handleUserInteraction, hasUserInteraction]);

  return { handleUserInteraction };
};
