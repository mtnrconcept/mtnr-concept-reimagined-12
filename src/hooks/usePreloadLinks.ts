
import { useCallback } from 'react';

/**
 * Hook that handles link preloading in document head
 */
export const usePreloadLinks = () => {
  /**
   * Add a preload link to document head for a video URL
   */
  const addPreloadLink = useCallback((url: string) => {
    try {
      // Vérifier si un lien preload existe déjà pour cette URL
      const existingLink = document.querySelector(`link[rel="preload"][href="${url}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = 'video';
        link.type = 'video/mp4';
        document.head.appendChild(link);
        console.log(`Lien preload ajouté pour: ${url}`);
      }
      return true;
    } catch (error) {
      console.error(`Erreur lors de la création du lien preload: ${url}`, error);
      return false;
    }
  }, []);

  return { addPreloadLink };
};
