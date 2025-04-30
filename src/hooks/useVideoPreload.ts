
import { useEffect } from 'react';

interface UseVideoPreloadProps {
  videoUrls: string[];
}

export const useVideoPreload = ({ videoUrls }: UseVideoPreloadProps) => {
  useEffect(() => {
    const preloadVideos = async () => {
      for (const url of videoUrls) {
        try {
          // Au lieu d'utiliser la balise link, créons un élément vidéo caché
          const video = document.createElement('video');
          video.src = url;
          video.preload = 'auto';
          video.muted = true;
          video.style.display = 'none';
          video.style.width = '1px';
          video.style.height = '1px';
          
          // Chargement des métadonnées seulement
          video.load();
          
          // Après 2 secondes, on peut supprimer l'élément
          setTimeout(() => {
            if (document.body.contains(video)) {
              document.body.removeChild(video);
            }
          }, 2000);
          
          document.body.appendChild(video);
          console.log(`Préchargement de la vidéo: ${url}`);
        } catch (error) {
          console.error(`Erreur lors du préchargement de la vidéo ${url}:`, error);
        }
      }
    };
    
    preloadVideos();
    
    // Nettoyage au démontage
    return () => {
      const preloadedVideos = document.querySelectorAll('video[style*="display: none"]');
      preloadedVideos.forEach(video => {
        if (document.body.contains(video)) {
          document.body.removeChild(video);
        }
      });
    };
  }, [videoUrls]);
};
