
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
      
      const preloadPromises = videoUrls.map(async (url) => {
        try {
          // Utiliser l'API link preload pour un chargement anticipé
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = url;
          link.as = 'video';
          link.type = 'video/mp4';
          document.head.appendChild(link);
          
          // Vérifier si la vidéo est accessible
          const response = await fetch(url, { method: 'HEAD' });
          if (!response.ok) {
            console.error(`La vidéo ${url} n'est pas disponible (${response.status})`);
            return false;
          } else {
            console.log(`Préchargement link de ${url} ajouté`);
            return true;
          }
        } catch (error) {
          console.error(`Erreur lors du préchargement de ${url}:`, error);
          return false;
        }
      });
      
      // Attendre que tous les préchargements soient terminés
      await Promise.all(preloadPromises);
    };

    // Précharger les vidéos au démarrage avec un léger délai pour éviter les conflits
    const timerId = setTimeout(() => {
      preloadVideos();
    }, 500);
    
    return () => {
      clearTimeout(timerId);
    };
  }, []);  // Dépendance vide pour exécuter une seule fois

  // Composant invisible qui gère uniquement le préchargement
  return null;
};

export default BackgroundVideoController;
