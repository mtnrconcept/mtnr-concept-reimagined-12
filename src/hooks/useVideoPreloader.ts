
import { useEffect, useRef, useState } from 'react';
import { toast } from "@/components/ui/use-toast";

interface UseVideoPreloaderProps {
  videoUrls: string[];
  onPreloaded?: (loadedUrls: string[]) => void;
  showToast?: boolean;
}

export const useVideoPreloader = ({ 
  videoUrls, 
  onPreloaded,
  showToast = false 
}: UseVideoPreloaderProps) => {
  const loadedVideos = useRef<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!videoUrls.length) {
      setIsLoading(false);
      return;
    }
    
    // Normaliser les URL (remplacer les espaces par des tirets)
    const normalizedUrls = videoUrls.map(url => url.replace(/\s+/g, '-'));
    
    const preloadVideo = async (url: string, index: number) => {
      try {
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
          
          // Ajouter des listeners de progression
          video.addEventListener('loadedmetadata', () => {
            setProgress(prev => Math.min(prev + (50 / normalizedUrls.length), 99));
          });
          
          // Événements de chargement
          video.addEventListener('canplaythrough', () => {
            console.log(`Vidéo ${url} préchargée avec succès`);
            loadedVideos.current.add(url);
            setProgress(prev => Math.min(prev + (50 / normalizedUrls.length), 100));
            resolve(true);
          }, { once: true });
          
          video.addEventListener('error', () => {
            console.error(`Erreur lors du préchargement de ${url}`);
            resolve(false);
          }, { once: true });
          
          // Définir la source et charger
          video.src = url;
          video.load();
          
          // Ajouter également un lien de préchargement dans le DOM
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
          }, 8000); // Timeout réduit à 8 secondes
        });
      } catch (error) {
        console.error(`Erreur lors du préchargement de ${url}:`, error);
        return false;
      }
    };
    
    // Précharger toutes les vidéos avec une priorité plus élevée pour les premières
    const loadAll = async () => {
      setIsLoading(true);
      setProgress(0);
      
      try {
        // Chargement séquentiel pour prioriser la première vidéo
        if (normalizedUrls.length > 0) {
          await preloadVideo(normalizedUrls[0], 0);
        }
        
        // Chargement parallèle pour le reste
        if (normalizedUrls.length > 1) {
          await Promise.all(
            normalizedUrls.slice(1).map((url, idx) => preloadVideo(url, idx + 1))
          );
        }
        
        const loadedUrls = [...loadedVideos.current];
        
        if (showToast && loadedUrls.length > 0) {
          toast({
            title: "Ressources chargées",
            description: `${loadedUrls.length} vidéos préchargées avec succès`,
            duration: 3000,
          });
        }
        
        if (onPreloaded && loadedUrls.length > 0) {
          onPreloaded(loadedUrls);
        }
      } catch (error) {
        console.error("Erreur lors du préchargement des vidéos:", error);
      } finally {
        setIsLoading(false);
        setProgress(100);
      }
    };
    
    loadAll();
  }, [videoUrls, onPreloaded, showToast]);
  
  return {
    isLoaded: (url: string) => loadedVideos.current.has(url),
    loadedCount: loadedVideos.current.size,
    isLoading,
    progress
  };
};
