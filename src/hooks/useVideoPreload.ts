
import { useEffect, useState, useRef } from 'react';
import { usePreloadLinks } from './usePreloadLinks';
import { useVideoPreloader } from './useVideoPreloader';
import { usePreloadStatus } from './usePreloadStatus';

interface UseVideoPreloadProps {
  videoUrls: string[];
  onPreloadComplete?: (results: Record<string, boolean>) => void;
  sequential?: boolean; // Option pour charger séquentiellement
}

/**
 * Main hook for video preloading with improved separation of concerns
 */
export const useVideoPreload = ({ 
  videoUrls, 
  onPreloadComplete,
  sequential = false
}: UseVideoPreloadProps) => {
  // Use our new separated hooks
  const { addPreloadLink } = usePreloadLinks();
  const { preloadVideo } = useVideoPreloader({ addPreloadLink });
  const { preloadStatus, updatePreloadStatus, isPreloading, setIsPreloading } = usePreloadStatus();
  
  const activePreloads = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    const preloadResults: Record<string, boolean> = {};
    let completedPreloads = 0;
    setIsPreloading(true);
    
    // Fonction principale pour précharger toutes les vidéos
    const preloadVideos = async () => {
      try {
        console.info('Préchargement des vidéos:', videoUrls);
        
        if (sequential) {
          // Mode séquentiel: un préchargement à la fois
          for (const url of videoUrls) {
            const result = await preloadVideo(url, activePreloads);
            preloadResults[url] = result;
            completedPreloads++;
          }
        } else {
          // Mode parallèle: tous les préchargements en même temps
          const results = await Promise.all(
            videoUrls.map(url => preloadVideo(url, activePreloads))
          );
          
          // Associer chaque résultat à son URL
          videoUrls.forEach((url, index) => {
            preloadResults[url] = results[index];
          });
          
          completedPreloads = videoUrls.length;
        }
        
        // Mise à jour de l'état et appel du callback
        updatePreloadStatus(preloadResults);
        setIsPreloading(false);
        
        if (onPreloadComplete) {
          onPreloadComplete(preloadResults);
        }
      } catch (error) {
        console.error('Erreur générale lors du préchargement des vidéos:', error);
        setIsPreloading(false);
        
        if (onPreloadComplete) {
          onPreloadComplete(preloadResults);
        }
      }
    };
    
    // Démarrer le préchargement
    preloadVideos();
    
    return () => {
      // Annuler les préchargements actifs si le composant est démonté
      activePreloads.current.clear();
    };
  }, [videoUrls, onPreloadComplete, sequential, preloadVideo, setIsPreloading, updatePreloadStatus]);
  
  return { preloadStatus, isPreloading };
};
