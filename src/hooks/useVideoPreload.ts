
import { useEffect, useState } from 'react';

interface UseVideoPreloadProps {
  videoUrls: string[];
  onPreloadComplete?: (results: Record<string, boolean>) => void;
}

export const useVideoPreload = ({ videoUrls, onPreloadComplete }: UseVideoPreloadProps) => {
  const [preloadStatus, setPreloadStatus] = useState<Record<string, boolean>>({});
  const [isPreloading, setIsPreloading] = useState(true);
  
  useEffect(() => {
    const preloadResults: Record<string, boolean> = {};
    let completedPreloads = 0;
    setIsPreloading(true);
    
    const preloadVideos = async () => {
      try {
        console.log('Préchargement des vidéos:', videoUrls);
        
        const preloadPromises = videoUrls.map(async (url) => {
          if (!url) {
            preloadResults[url] = false;
            return;
          }
          
          try {
            // Vérifier d'abord si la vidéo est accessible
            const response = await fetch(url, { method: 'HEAD' });
            const isAvailable = response.ok;
            preloadResults[url] = isAvailable;
            
            if (isAvailable) {
              // Créer un lien de préchargement
              const link = document.createElement('link');
              link.rel = 'preload';
              link.href = url;
              link.as = 'video';
              link.type = 'video/mp4';
              document.head.appendChild(link);
              
              // Créer également un élément vidéo pour précharger les métadonnées
              const video = document.createElement('video');
              video.preload = 'metadata';
              video.muted = true;
              video.playsInline = true;
              
              // Créer une promesse pour attendre le chargement
              await new Promise<void>((resolve, reject) => {
                video.onloadedmetadata = () => {
                  console.log(`Métadonnées chargées pour: ${url}`);
                  resolve();
                };
                
                video.onerror = () => {
                  console.warn(`Erreur lors du préchargement des métadonnées: ${url}`);
                  // On marque quand même comme résolu pour ne pas bloquer
                  resolve();
                };
                
                // Timeout après 3 secondes
                const timeout = setTimeout(() => {
                  console.warn(`Timeout du préchargement pour: ${url}`);
                  resolve();
                }, 3000);
                
                video.onloadedmetadata = () => {
                  clearTimeout(timeout);
                  resolve();
                };
                
                video.src = url;
                video.load();
              });
            } else {
              console.error(`La vidéo n'est pas accessible: ${url}, status: ${response.status}`);
            }
          } catch (error) {
            console.error(`Erreur lors de la vérification de la vidéo ${url}:`, error);
            preloadResults[url] = false;
          }
          
          completedPreloads++;
          console.log(`Préchargement ${completedPreloads}/${videoUrls.length} terminé`);
        });
        
        await Promise.all(preloadPromises);
        
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
      // Cleanup if needed
    };
  }, [videoUrls, onPreloadComplete]);
  
  return { preloadStatus, isPreloading };
};
