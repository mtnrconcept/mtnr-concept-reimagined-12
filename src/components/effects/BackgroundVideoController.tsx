
import { useEffect } from 'react';

export const BackgroundVideoController = () => {
  useEffect(() => {
    // Préchargement des vidéos - Une seule fois au démarrage de l'application
    const preloadVideos = async () => {
      console.info('Préchargement des vidéos de fond');
      
      const videoUrls = [
        '/lovable-uploads/Video fond normale.mp4',
        '/lovable-uploads/Video fond UV.mp4'
      ];
      
      for (const url of videoUrls) {
        try {
          // Créer un élément vidéo pour précharger
          const video = document.createElement('video');
          video.preload = 'auto';
          video.muted = true;
          video.src = url;
          video.load();
          
          // Ajouter les écouteurs pour suivre le préchargement
          video.addEventListener('loadeddata', () => {
            console.log(`Vidéo ${url} préchargée avec succès`);
          });
          
          video.addEventListener('error', (e) => {
            console.error(`Erreur lors du préchargement de ${url}:`, e);
          });
          
          // Alternative avec link preload
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = url;
          link.as = 'video';
          link.type = 'video/mp4';
          document.head.appendChild(link);
        } catch (error) {
          console.error(`Erreur lors du préchargement de ${url}:`, error);
        }
      }
    };

    // Précharger les vidéos au démarrage
    preloadVideos();
    
    return () => {
      // Nettoyage si nécessaire
    };
  }, []);

  // Composant invisible qui gère uniquement le préchargement
  return null;
};

export default BackgroundVideoController;
