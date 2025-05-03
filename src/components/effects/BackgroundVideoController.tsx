
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const BackgroundVideoController = () => {
  const location = useLocation();

  useEffect(() => {
    // Préchargement des vidéos
    const preloadVideos = async () => {
      console.info('Préchargement des vidéos');
      
      const videoUrls = [
        '/lovable-uploads/Composition_1.mp4',
        '/lovable-uploads/Composition_1_1.mp4'
      ];
      
      try {
        // Précharger les deux vidéos
        for (const url of videoUrls) {
          // Tenter de mettre en cache les vidéos
          if ('caches' in window) {
            const cache = await caches.open('video-cache');
            try {
              await cache.add(url);
              console.info(`Vidéo ${url} mise en cache`);
            } catch (err) {
              console.error(`Erreur lors de la mise en cache de ${url}:`, err);
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
            console.info(`Vidéo ${url} préchargée complètement`);
          });
          
          video.addEventListener('loadeddata', () => {
            console.info(`Vidéo ${url} chargée`);
          });
        }
      } catch (err) {
        console.error('Erreur de préchargement:', err);
      }
    };

    // Précharger les vidéos dès que le composant est monté
    preloadVideos();
    
    return () => {
      // Cleanup si nécessaire
    };
  }, []);

  // Composant invisible qui gère uniquement le préchargement
  return null;
};

export default BackgroundVideoController;
