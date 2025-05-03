
import React, { useEffect } from 'react';
import { getCachedResource } from '@/lib/preloader';

interface VideoElementProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoUrl: string;
  videoUrlUV: string;
  uvMode: boolean;
}

const VideoElement: React.FC<VideoElementProps> = ({ 
  videoRef, 
  videoUrl, 
  videoUrlUV, 
  uvMode 
}) => {
  
  // Utiliser l'API de préchargement pour optimiser les performances
  useEffect(() => {
    if (!videoRef.current) return;
    
    const currentUrl = uvMode ? videoUrlUV : videoUrl;
    
    // Vérifier si la vidéo est déjà mise en cache via notre système de préchargement
    const cachedVideo = getCachedResource('video', currentUrl);
    
    if (cachedVideo) {
      console.log(`Utilisation de la vidéo préchargée: ${currentUrl}`);
      
      // On peut potentiellement copier certaines propriétés de la vidéo préchargée
      // Mais cette approche n'est généralement pas nécessaire, car src fait le travail
    }
    
    // Utiliser une stratégie de mise en cache via l'API Cache si disponible
    if ('caches' in window) {
      caches.open('video-cache').then(cache => {
        cache.match(currentUrl).then(response => {
          if (response) {
            console.log(`Vidéo ${currentUrl} trouvée dans le cache API`);
          } else {
            console.log(`Mise en cache de ${currentUrl} via l'API Cache`);
            // La méthode add effectue un fetch et met en cache le résultat
            cache.add(currentUrl).catch(err => {
              console.warn(`Échec de la mise en cache de ${currentUrl}:`, err);
            });
          }
        });
      });
    }
  }, [videoRef, videoUrl, videoUrlUV, uvMode]);
  
  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      playsInline
      muted
      preload="auto"
      style={{
        // Optimisation des performances
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        // Augmentation de l'échelle pour éviter les bords vides lors des mouvements
        scale: '1.1'
      }}
    >
      <source src={uvMode ? videoUrlUV : videoUrl} type="video/mp4" />
    </video>
  );
};

export default VideoElement;
