
import { useState, useCallback } from 'react';
import { useVideoPreload } from './useVideoPreload';

/**
 * Hook to manage video availability status and verification
 */
export const useVideoAvailability = (normalVideoUrl: string, uvVideoUrl: string) => {
  const [videoAvailability, setVideoAvailability] = useState({
    normal: true,
    uv: true
  });

  // Précharger les vidéos et vérifier leur disponibilité
  const { preloadStatus } = useVideoPreload({
    videoUrls: [normalVideoUrl, uvVideoUrl],
    onPreloadComplete: (results) => {
      setVideoAvailability({
        normal: results[normalVideoUrl] ?? false,
        uv: results[uvVideoUrl] ?? false
      });
      
      console.log('Statut de préchargement des vidéos:', results);
    }
  });
  
  // Fonction pour mettre à jour le statut de disponibilité
  const updateAvailabilityStatus = useCallback((src: string, isAvailable: boolean) => {
    if (src.includes('normale')) {
      setVideoAvailability(prev => ({ ...prev, normal: isAvailable }));
    } else if (src.includes('UV')) {
      setVideoAvailability(prev => ({ ...prev, uv: isAvailable }));
    }
  }, []);

  return {
    videoAvailability,
    updateAvailabilityStatus
  };
};
