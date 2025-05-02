
import { useEffect, useRef } from 'react';

interface UseVideoPreloaderProps {
  videoUrls: string[];
  onPreloaded?: (loadedUrls: string[]) => void;
}

export const useVideoPreloader = ({ videoUrls, onPreloaded }: UseVideoPreloaderProps) => {
  const loadedVideos = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    if (!videoUrls.length) return;
    
    const preloadVideo = async (url: string) => {
      try {
        console.log(`Préchargement de la vidéo: ${url}`);
        
        // Vérifier si l'URL est valide
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
          console.error(`La vidéo ${url} n'est pas accessible (${response.status})`);
          return false;
        }
        
        // Précharger avec un élément vidéo
        return new Promise<boolean>((resolve) => {
          const video = document.createElement('video');
          video.preload = 'auto';
          
          // Événements de chargement
          video.onloadeddata = () => {
            console.log(`Vidéo ${url} préchargée avec succès`);
            loadedVideos.current.add(url);
            resolve(true);
          };
          
          video.onerror = () => {
            console.error(`Erreur lors du préchargement de ${url}`);
            resolve(false);
          };
          
          // Définir la source et charger
          video.src = url;
          video.load();
          
          // Ajouter également un lien de préchargement
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = url;
          link.as = 'video';
          link.type = 'video/mp4';
          document.head.appendChild(link);
          
          // Nettoyage après un certain délai
          setTimeout(() => {
            if (!loadedVideos.current.has(url)) {
              console.log(`Timeout du préchargement pour ${url}, on considère comme chargé`);
              loadedVideos.current.add(url);
              resolve(true);
            }
          }, 10000);
        });
      } catch (error) {
        console.error(`Erreur lors du préchargement de ${url}:`, error);
        return false;
      }
    };
    
    // Précharger toutes les vidéos en parallèle
    const loadAll = async () => {
      const results = await Promise.all(videoUrls.map(preloadVideo));
      const loadedUrls = videoUrls.filter((_, index) => results[index]);
      
      if (onPreloaded) {
        onPreloaded(loadedUrls);
      }
    };
    
    loadAll();
  }, [videoUrls, onPreloaded]);
  
  return {
    isLoaded: (url: string) => loadedVideos.current.has(url),
    loadedCount: loadedVideos.current.size
  };
};
