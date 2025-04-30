import { useEffect, useState, useRef } from 'react';
import { useVideoPreload } from '@/hooks/useVideoPreload';
import { toast } from 'sonner';
import { useNavigation } from './NavigationContext';

export const BackgroundVideoController = () => {
  const [preloadComplete, setPreloadComplete] = useState(false);
  const loadAttemptsMade = useRef(0);
  const maxLoadAttempts = 3;
  const navigation = useNavigation();
  
  // Précharger les vidéos avec la logique refactorisée
  const { preloadStatus, isPreloading } = useVideoPreload({
    videoUrls: [
      '/lovable-uploads/Videofondnormale.mp4',
      '/lovable-uploads/VideofondUV.mp4'
    ],
    // Limiter à un seul préchargement à la fois
    sequential: true,
    onPreloadComplete: (results) => {
      console.info('Résultats du préchargement:', results);
      setPreloadComplete(true);
      
      // Vérifier disponibilité
      const isNormalVideoAvailable = results['/lovable-uploads/Videofondnormale.mp4'];
      const isUVVideoAvailable = results['/lovable-uploads/VideofondUV.mp4'];
      
      // Afficher le statut
      console.log(`Vidéo normale disponible: ${isNormalVideoAvailable ? 'Oui' : 'Non'}`);
      console.log(`Vidéo UV disponible: ${isUVVideoAvailable ? 'Oui' : 'Non'}`);
      
      // Si les vidéos sont disponibles, déclencher une transition
      if (isNormalVideoAvailable || isUVVideoAvailable) {
        setTimeout(() => {
          navigation.triggerVideoTransition();
          console.log("Transition vidéo déclenchée après préchargement réussi");
        }, 500);
      }
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
