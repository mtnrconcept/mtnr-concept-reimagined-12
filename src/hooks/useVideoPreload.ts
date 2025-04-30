
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
        
        // Vérifier d'abord si la vidéo est accessible avec une requête HEAD
        try {
          const response = await fetch(url, { method: 'HEAD', cache: 'force-cache' });
          const isAvailable = response.ok;
          preloadResults[url] = isAvailable;
          
          if (isAvailable) {
            // Utiliser un lien preload avec le bon type
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = url;
            link.as = 'video';
            link.type = 'video/mp4';
            document.head.appendChild(link);
            
            // Éviter de créer des éléments vidéo pour le préchargement
            // Chrome a une limite de WebMediaPlayers
            console.log(`Préchargement ${completedPreloads + 1}/${videoUrls.length} terminé`);
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
    };
    
    const preloadVideos = async () => {
      try {
        console.info('Préchargement des vidéos:', videoUrls);
        
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
