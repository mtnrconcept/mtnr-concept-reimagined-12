
import { useEffect, useState, useRef } from 'react';

interface UseVideoPreloadProps {
  videoUrls: string[];
  onPreloadComplete?: (results: Record<string, boolean>) => void;
  sequential?: boolean; // Option pour charger séquentiellement
}

export const useVideoPreload = ({ 
  videoUrls, 
  onPreloadComplete,
  sequential = false
}: UseVideoPreloadProps) => {
  const [preloadStatus, setPreloadStatus] = useState<Record<string, boolean>>({});
  const [isPreloading, setIsPreloading] = useState(true);
  const activePreloads = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    const preloadResults: Record<string, boolean> = {};
    let completedPreloads = 0;
    setIsPreloading(true);
    
    const preloadVideo = async (url: string): Promise<void> => {
      if (!url || activePreloads.current.has(url)) {
        preloadResults[url] = false;
        return Promise.resolve();
      }
      
      try {
        // Éviter les préchargements simultanés du même URL
        activePreloads.current.add(url);
        
        // Vérifier d'abord si la vidéo est accessible
        try {
          const response = await fetch(url, { method: 'HEAD', cache: 'force-cache' });
          const isAvailable = response.ok;
          preloadResults[url] = isAvailable;
          
          if (isAvailable) {
            // Créer un lien de préchargement dans le DOM
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = url;
            link.as = 'video';
            link.type = 'video/mp4';
            document.head.appendChild(link);
            
            // Solution compatible Chrome: ne pas créer trop d'éléments vidéo
            // Au lieu de créer un élément vidéo, faire une promesse avec timeout
            await new Promise<void>((resolve) => {
              // Timeout après 3 secondes pour ne pas bloquer
              setTimeout(() => {
                resolve();
              }, 3000);
            });
          } else {
            console.error(`La vidéo n'est pas accessible: ${url}, status: ${response.status}`);
          }
        } catch (error) {
          console.error(`Erreur lors de la vérification de la vidéo ${url}:`, error);
          preloadResults[url] = false;
        } finally {
          activePreloads.current.delete(url);
        }
      } catch (error) {
        console.error(`Erreur lors du préchargement de la vidéo ${url}:`, error);
        preloadResults[url] = false;
        activePreloads.current.delete(url);
      }
      
      completedPreloads++;
      console.log(`Préchargement ${completedPreloads}/${videoUrls.length} terminé`);
    };
    
    const preloadVideos = async () => {
      try {
        console.log('Préchargement des vidéos:', videoUrls);
        
        if (sequential) {
          // Mode séquentiel: un préchargement à la fois pour éviter les problèmes Chrome
          for (const url of videoUrls) {
            await preloadVideo(url);
          }
        } else {
          // Mode parallèle: tous les préchargements en même temps
          await Promise.all(videoUrls.map(preloadVideo));
        }
        
        setPreloadStatus(preloadResults);
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
    
    preloadVideos();
    
    return () => {
      // Annuler les préchargements actifs si le composant est démonté
      activePreloads.current.clear();
    };
  }, [videoUrls, onPreloadComplete, sequential]);
  
  return { preloadStatus, isPreloading };
};
