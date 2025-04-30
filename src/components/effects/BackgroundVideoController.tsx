
import { useEffect } from 'react';

export const BackgroundVideoController = () => {
  useEffect(() => {
    // Préchargement des vidéos
    const preloadVideos = async () => {
      console.info('Préchargement des vidéos');
      
      const videoUrls = [
        '/lovable-uploads/Composition 1.mp4',
        '/lovable-uploads/Composition 1_1.mp4'
      ];
      
      try {
        // Précharger avec la méthode Link preload pour optimiser les performances
        for (const url of videoUrls) {
          // Utiliser l'API link preload pour un chargement anticipé
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = url;
          link.as = 'video';
          link.type = 'video/mp4';
          document.head.appendChild(link);
          
          // Créer un élément vidéo en arrière-plan pour précharger
          const video = document.createElement('video');
          video.preload = 'auto';
          video.muted = true;
          video.src = url;
          video.style.display = 'none';
          video.load();
          
          // Événements de préchargement
          video.addEventListener('loadedmetadata', () => {
            console.info(`Métadonnées chargées pour ${url}`);
          });
          
          video.addEventListener('canplaythrough', () => {
            console.info(`Vidéo ${url} préchargée complètement`);
            // Supprimer l'élément après préchargement pour libérer de la mémoire
            setTimeout(() => {
              video.remove();
            }, 1000);
          });
        }
      } catch (err) {
        console.error('Erreur de préchargement:', err);
      }
    };

    // Précharger les vidéos au démarrage
    preloadVideos();
  }, []);

  // Composant invisible qui gère uniquement le préchargement
  return null;
};

export default BackgroundVideoController;
