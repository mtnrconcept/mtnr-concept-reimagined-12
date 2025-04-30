
import { useEffect, useState, useRef } from 'react';
import { useVideoPreload } from '@/hooks/useVideoPreload';
import { toast } from 'sonner';

export const BackgroundVideoController = () => {
  const [preloadComplete, setPreloadComplete] = useState(false);
  const loadAttemptsMade = useRef(0);
  const maxLoadAttempts = 3;
  
  // Précharger les vidéos avec la nouvelle logique améliorée
  // On limite le nombre d'éléments vidéo créés simultanément
  const { preloadStatus, isPreloading } = useVideoPreload({
    videoUrls: [
      '/lovable-uploads/Videofondnormale.mp4',
      '/lovable-uploads/VideofondUV.mp4'
    ],
    // Limiter à un seul préchargement à la fois
    sequential: true,
    onPreloadComplete: (results) => {
      console.log('Résultats du préchargement:', results);
      setPreloadComplete(true);
      
      // Diagnostiquer les problèmes éventuels
      Object.entries(results).forEach(([url, isAvailable]) => {
        if (!isAvailable && loadAttemptsMade.current < maxLoadAttempts) {
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
      if (!allVideosAvailable && loadAttemptsMade.current < maxLoadAttempts) {
        // Incrémenter le compteur de tentatives
        loadAttemptsMade.current += 1;
        
        if (loadAttemptsMade.current >= maxLoadAttempts) {
          // Notifier l'utilisateur après les tentatives maximales
          toast.warning("Certaines vidéos n'ont pas pu être préchargées. L'expérience peut être affectée.", {
            duration: 5000,
          });
          console.warn(`⚠️ Abandon après ${maxLoadAttempts} tentatives de préchargement vidéo`);
        }
      }
    }
  }, [preloadComplete, preloadStatus]);

  // Composant invisible qui gère uniquement le préchargement
  return null;
};

export default BackgroundVideoController;
