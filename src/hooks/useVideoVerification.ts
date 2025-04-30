
import { useCallback } from 'react';
import { useVideoLoad } from './useVideoLoad';

/**
 * Hook to handle video verification before transitions
 */
export const useVideoVerification = () => {
  const { verifyVideoPlayability } = useVideoLoad();
  
  // Fonction pour vérifier la jouabilité avant de déclencher une transition
  const verifyAndPrepareVideo = useCallback(async (
    videoUrl: string, 
    videoRef: HTMLVideoElement | null
  ): Promise<boolean> => {
    if (!videoRef) {
      console.warn("Référence vidéo non disponible");
      return false;
    }
    
    try {
      // Vérifier si la vidéo est jouable - simple et efficace
      const isPlayable = await verifyVideoPlayability(videoUrl);
      if (!isPlayable) {
        console.error(`La vidéo ${videoUrl} n'est pas jouable, transition annulée`);
        return false;
      }
      
      // Préparation de la vidéo sans appeler load()
      videoRef.currentTime = 0;
      videoRef.loop = false;
      videoRef.muted = true;
      videoRef.playsInline = true;
      
      console.log(`Vidéo vérifiée et prête pour la transition`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la vérification de la vidéo ${videoUrl}:`, error);
      return false;
    }
  }, [verifyVideoPlayability]);

  return { verifyAndPrepareVideo };
};
