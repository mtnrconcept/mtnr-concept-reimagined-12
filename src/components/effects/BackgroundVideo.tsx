
import React, { useEffect } from 'react';
import VideoContainer from './video/VideoContainer';
import { getCachedResource, isResourceCached } from '@/lib/preloader';

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ 
  videoUrl = "/lovable-uploads/videonormale.mp4", 
  videoUrlUV = "/lovable-uploads/videouv.mp4"
}) => {
  // Vérifier et signaler l'état de préchargement au chargement du composant
  useEffect(() => {
    // Vérifier si les vidéos sont dans le cache
    const normalVideoReady = isResourceCached('video', videoUrl);
    const uvVideoReady = isResourceCached('video', videoUrlUV);
    
    console.info(`État du préchargement des vidéos:`, {
      normalVideo: normalVideoReady ? 'En cache' : 'Non préchargée',
      uvVideo: uvVideoReady ? 'En cache' : 'Non préchargée'
    });
    
    // Forcer un second préchargement si nécessaire
    if (!normalVideoReady || !uvVideoReady) {
      console.info('Certaines vidéos ne sont pas préchargées, lancement d\'un second préchargement');
      
      // Cette fonction peut être appelée depuis BackgroundVideoController
      if (typeof window !== 'undefined' && window.__forcePrecacheVideos) {
        window.__forcePrecacheVideos();
      }
    }
  }, [videoUrl, videoUrlUV]);
  
  return <VideoContainer videoUrl={videoUrl} videoUrlUV={videoUrlUV} />;
};

export default BackgroundVideo;
