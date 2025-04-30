
import { useEffect, useState } from 'react';
import { useVideoPreload } from '@/hooks/useVideoPreload';

export const BackgroundVideoController = () => {
  const [preloadComplete, setPreloadComplete] = useState(false);
  
  // Précharger les vidéos avec la nouvelle logique améliorée
  const { preloadStatus, isPreloading } = useVideoPreload({
    videoUrls: [
      '/lovable-uploads/Videofondnormale.mp4',
      '/lovable-uploads/VideofondUV.mp4'
    ],
    onPreloadComplete: (results) => {
      console.log('Résultats du préchargement:', results);
      setPreloadComplete(true);
      
      // Diagnostiquer les problèmes éventuels
      Object.entries(results).forEach(([url, isAvailable]) => {
        if (!isAvailable) {
          console.warn(`⚠️ La vidéo ${url} n'est pas disponible ou ne peut pas être préchargée.`);
          
          // Suggestion de vérification
          console.info(`Veuillez vérifier que le fichier existe dans le dossier public/lovable-uploads/`);
          console.info(`et que le nom est exactement correct (sensible à la casse).`);
        }
      });
    }
  });
  
  // Signaler l'état du préchargement
  useEffect(() => {
    if (preloadComplete) {
      console.info('✅ Préchargement des vidéos terminé');
      
      // Vérifier les résultats
      const allVideosAvailable = Object.values(preloadStatus).every(status => status === true);
      if (!allVideosAvailable) {
        console.warn('⚠️ Certaines vidéos n\'ont pas pu être préchargées');
      }
    }
  }, [preloadComplete, preloadStatus]);

  // Composant invisible qui gère uniquement le préchargement
  return null;
};

export default BackgroundVideoController;
