
import { useEffect } from 'react';

interface UseVideoPreloadProps {
  videoUrls: string[];
}

export const useVideoPreload = ({ videoUrls }: UseVideoPreloadProps) => {
  useEffect(() => {
    const preloadVideos = async () => {
      try {
        console.log('Préchargement des vidéos:', videoUrls);
        
        for (const url of videoUrls) {
          if (!url) continue;
          
          // Créer un lien de préchargement
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = url;
          link.as = 'video';
          link.type = 'video/mp4';
          document.head.appendChild(link);
          
          // Vérifier si la vidéo est accessible
          try {
            const response = await fetch(url, { method: 'HEAD' });
            if (!response.ok) {
              console.error(`Erreur de préchargement: La vidéo ${url} n'est pas disponible (${response.status})`);
            } else {
              console.log(`Préchargement de ${url} réussi`);
            }
          } catch (error) {
            console.error(`Erreur lors de la vérification de la vidéo ${url}:`, error);
          }
        }
      } catch (error) {
        console.error('Erreur lors du préchargement des vidéos:', error);
      }
    };
    
    preloadVideos();
  }, [videoUrls]);
};
