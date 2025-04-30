
import { useCallback } from 'react';
import { useVideoAvailabilityCheck } from './useVideoAvailabilityCheck';

interface UseVideoPreloaderProps {
  addPreloadLink: (url: string) => boolean;
}

/**
 * Hook responsible for preloading a single video
 */
export const useVideoPreloader = ({ addPreloadLink }: UseVideoPreloaderProps) => {
  const { checkVideoAvailability } = useVideoAvailabilityCheck();

  /**
   * Preloads a single video and returns preload success status
   */
  const preloadVideo = useCallback(async (
    url: string,
    activePreloads: React.RefObject<Set<string>>
  ): Promise<boolean> => {
    if (!url || (activePreloads.current && activePreloads.current.has(url))) {
      return false;
    }
    
    try {
      if (activePreloads.current) {
        activePreloads.current.add(url);
      }
      
      // Vérifier d'abord la disponibilité par HTTP
      const isAvailable = await checkVideoAvailability(url);
      
      if (isAvailable) {
        // Si disponible, ajouter le lien preload
        addPreloadLink(url);
        
        // Créer également un élément vidéo hors-DOM pour précharger
        const tempVideo = document.createElement('video');
        tempVideo.preload = 'auto';
        tempVideo.muted = true;
        tempVideo.playsInline = true;
        tempVideo.src = url;
        
        // Attendre le chargement des métadonnées
        const isLoaded = await new Promise<boolean>((resolve) => {
          const loaded = () => {
            resolve(true);
            tempVideo.removeEventListener('loadedmetadata', loaded);
            tempVideo.removeEventListener('error', errorHandler);
          };
          
          const errorHandler = () => {
            console.warn(`Erreur lors du préchargement vidéo: ${url}`);
            resolve(false);
            tempVideo.removeEventListener('loadedmetadata', loaded);
            tempVideo.removeEventListener('error', errorHandler);
          };
          
          tempVideo.addEventListener('loadedmetadata', loaded);
          tempVideo.addEventListener('error', errorHandler);
          
          // Timeout pour éviter d'attendre indéfiniment
          setTimeout(() => resolve(false), 5000);
        });
        
        console.log(`Préchargement de ${url} terminé avec succès: ${isLoaded}`);
        return isLoaded;
      } else {
        console.warn(`La vidéo n'est pas accessible: ${url}`);
        return false;
      }
      
    } catch (error) {
      console.error(`Erreur lors du préchargement de la vidéo ${url}:`, error);
      return false;
    } finally {
      if (activePreloads.current) {
        activePreloads.current.delete(url);
      }
    }
  }, [checkVideoAvailability, addPreloadLink]);

  return { preloadVideo };
};
