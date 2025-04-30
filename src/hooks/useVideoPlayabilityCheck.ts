
import { useCallback } from 'react';

/**
 * Hook for checking if a video is playable before attempting playback
 */
export const useVideoPlayabilityCheck = () => {
  /**
   * Verifies if a video URL is accessible and potentially playable
   */
  const verifyVideoPlayability = useCallback(async (videoUrl: string): Promise<boolean> => {
    try {
      console.log(`Vérification de jouabilité pour: ${videoUrl}`);
      
      // Vérifier uniquement les métadonnées au lieu de l'ensemble du fichier
      const response = await fetch(videoUrl, { 
        method: 'HEAD',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!response.ok) {
        console.error(`La vidéo ${videoUrl} n'est pas accessible. Status: ${response.status}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la vérification de ${videoUrl}:`, error);
      return false;
    }
  }, []);
  
  return { verifyVideoPlayability };
};
