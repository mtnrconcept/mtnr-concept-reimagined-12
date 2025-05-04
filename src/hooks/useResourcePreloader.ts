
import { useState, useEffect } from 'react';

interface UseResourcePreloaderOptions {
  onComplete?: () => void;
}

export function useResourcePreloader(
  resources: string[],
  options: UseResourcePreloaderOptions = {}
) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    const { onComplete } = options;
    let mounted = true;
    
    const preloadResources = async () => {
      const total = resources.length;
      if (total === 0) {
        setProgress(100);
        setIsComplete(true);
        onComplete?.();
        return;
      }
      
      let loaded = 0;
      
      // Précharger les ressources
      const preloadPromises = resources.map((url) => {
        return new Promise<void>((resolve) => {
          if (url.endsWith('.mp4')) {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.muted = true;
            video.src = url;
            
            // Événement lorsque les métadonnées sont chargées (première partie du chargement)
            video.onloadedmetadata = () => {
              if (mounted) {
                // Compter comme chargé partiellement
                loaded += 0.5;
                const newProgress = Math.floor((loaded / total) * 100);
                setProgress(Math.min(newProgress, 99)); // Max 99% until fully loaded
              }
            };
            
            video.onloadeddata = () => {
              if (mounted) {
                // Compter comme complètement chargé
                loaded += 0.5;
                const newProgress = Math.floor((loaded / total) * 100);
                setProgress(newProgress);
                resolve();
              }
            };
            
            video.onerror = () => {
              if (mounted) {
                loaded++;
                const newProgress = Math.floor((loaded / total) * 100);
                setProgress(newProgress);
                console.error(`Error loading video: ${url}`);
                resolve();
              }
            };
            
            // Commencer le chargement
            video.load();
          } else {
            const img = new Image();
            img.src = url;
            
            img.onload = () => {
              if (mounted) {
                loaded++;
                const newProgress = Math.floor((loaded / total) * 100);
                setProgress(newProgress);
                resolve();
              }
            };
            
            img.onerror = () => {
              if (mounted) {
                loaded++;
                const newProgress = Math.floor((loaded / total) * 100);
                setProgress(newProgress);
                console.error(`Error loading image: ${url}`);
                resolve();
              }
            };
          }
        });
      });
      
      // Attendre que toutes les ressources soient chargées
      await Promise.all(preloadPromises);
      
      if (mounted) {
        setIsComplete(true);
        onComplete?.();
      }
    };
    
    // Démarrer le préchargement
    preloadResources();
    
    // Nettoyer
    return () => {
      mounted = false;
    };
  }, [resources, options]);
  
  return {
    progress,
    isComplete
  };
}
