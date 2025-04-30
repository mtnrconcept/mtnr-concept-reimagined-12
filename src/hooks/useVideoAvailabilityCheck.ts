
import { useCallback } from 'react';

/**
 * Hook for checking if a video is available via HTTP request
 */
export const useVideoAvailabilityCheck = () => {
  /**
   * Check if a video is available via HTTP HEAD request
   */
  const checkVideoAvailability = useCallback(async (url: string): Promise<boolean> => {
    try {
      console.log(`Vérification de disponibilité: ${url}`);
      const response = await fetch(url, { 
        method: 'HEAD', 
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' }
      });
      return response.ok;
    } catch (error) {
      console.error(`Erreur lors de la vérification HTTP: ${url}`, error);
      return false;
    }
  }, []);

  return { checkVideoAvailability };
};
