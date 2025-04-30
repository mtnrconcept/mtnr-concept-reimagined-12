
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
    
    // Fonction pour vérifier la disponibilité d'une vidéo par HTTP
    const checkVideoAvailability = async (url: string): Promise<boolean> => {
      try {
        console.log(`Vérification de disponibilité: ${url}`);
        const response = await fetch(url, { 
          method: 'HEAD', 
          cache: 'no-cache',
          headers: { 'Cache-Control': 'no-cache' }
        });
        return response.ok;
      } catch (error) {
        console.error(`Erreur lors de la vérification HTTP: ${url}`, error);
        return false;
      }
    };
    
    // Fonction pour précharger une vidéo par lien preload
    const addPreloadLink = (url: string) => {
      try {
        // Vérifier si un lien preload existe déjà pour cette URL
        const existingLink = document.querySelector(`link[rel="preload"][href="${url}"]`);
        if (!existingLink) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = url;
          link.as = 'video';
          link.type = 'video/mp4';
          document.head.appendChild(link);
          console.log(`Lien preload ajouté pour: ${url}`);
        }
        return true;
      } catch (error) {
        console.error(`Erreur lors de la création du lien preload: ${url}`, error);
        return false;
      }
    };
    
    // Fonction pour précharger une seule vidéo
    const preloadVideo = async (url: string): Promise<void> => {
      if (!url || activePreloads.current.has(url)) {
        preloadResults[url] = false;
        completedPreloads++;
        return Promise.resolve();
      }
      
      try {
        activePreloads.current.add(url);
        
        // Vérifier d'abord la disponibilité par HTTP
        const isAvailable = await checkVideoAvailability(url);
        
        if (isAvailable) {
          // Si disponible, ajouter le lien preload
          addPreloadLink(url);
          
          // Créer également un élément vidéo hors-DOM pour précharger
          const tempVideo = document.createElement('video');
          tempVideo.preload = 'auto';
          tempVideo.muted = true;
          tempVideo.playsInline = true;
          tempVideo.src = url;
          
          // Attendre le chargement des métadonnées
          await new Promise<void>((resolve) => {
            const loaded = () => {
              resolve();
              tempVideo.removeEventListener('loadedmetadata', loaded);
              tempVideo.removeEventListener('error', errorHandler);
            };
            
            const errorHandler = () => {
              console.warn(`Erreur lors du préchargement vidéo: ${url}`);
              resolve(); // Résoudre quand même pour continuer
              tempVideo.removeEventListener('loadedmetadata', loaded);
              tempVideo.removeEventListener('error', errorHandler);
            };
            
            tempVideo.addEventListener('loadedmetadata', loaded);
            tempVideo.addEventListener('error', errorHandler);
            
            // Timeout pour éviter d'attendre indéfiniment
            setTimeout(resolve, 5000);
          });
          
          preloadResults[url] = true;
          console.log(`Préchargement ${completedPreloads + 1}/${videoUrls.length} terminé`);
        } else {
          console.warn(`La vidéo n'est pas accessible: ${url}`);
          preloadResults[url] = false;
        }
        
      } catch (error) {
        console.error(`Erreur lors du préchargement de la vidéo ${url}:`, error);
        preloadResults[url] = false;
      } finally {
        activePreloads.current.delete(url);
        completedPreloads++;
      }
    };
    
    // Fonction principale pour précharger toutes les vidéos
    const preloadVideos = async () => {
      try {
        console.info('Préchargement des vidéos:', videoUrls);
        
        if (sequential) {
          // Mode séquentiel: un préchargement à la fois
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
    
    // Démarrer le préchargement
    preloadVideos();
    
    return () => {
      // Annuler les préchargements actifs si le composant est démonté
      activePreloads.current.clear();
    };
  }, [videoUrls, onPreloadComplete, sequential]);
  
  return { preloadStatus, isPreloading };
};
