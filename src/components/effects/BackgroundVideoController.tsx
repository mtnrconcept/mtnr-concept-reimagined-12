
import { useEffect } from 'react';

export const BackgroundVideoController = () => {
  useEffect(() => {
    // Préchargement de la vidéo
    const preloadVideo = async (url: string) => {
      console.info('Vidéo préchargée');
      
      try {
        // Tenter de mettre en cache la vidéo
        if ('caches' in window) {
          const cache = await caches.open('video-cache');
          try {
            await cache.add(url);
            console.info('Vidéo mise en cache');
          } catch (err) {
            console.error('Erreur lors de la mise en cache:', err);
          }
        }
        
        // Créer un élément vidéo pour précharger
        const video = document.createElement('video');
        video.preload = 'auto';
        video.muted = true;
        video.src = url;
        video.load();
        
        // Attendre que la vidéo soit suffisamment chargée
        video.addEventListener('canplaythrough', () => {
          console.info('Vidéo préchargée complètement');
        });
        
        video.addEventListener('loadeddata', () => {
          console.info('Vidéo chargée');
        });
        
      } catch (err) {
        console.error('Erreur de préchargement:', err);
      }
    };

    // Précharger la vidéo dès que le composant est monté
    preloadVideo('/lovable-uploads/staircase-video.mp4');
    
    return () => {
      // Cleanup si nécessaire
    };
  }, []);

  // Composant invisible qui gère uniquement le préchargement
  return null;
};

export default BackgroundVideoController;
