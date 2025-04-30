
import React, { useRef, useEffect, useState } from 'react';
import { create } from 'zustand';

interface BackgroundVideoStore {
  isPlaying: boolean;
  playDirection: 'forward' | 'reverse';
  startVideo: (direction: 'forward' | 'reverse') => void;
  pauseVideo: () => void;
  resetVideo: () => void;
}

// Store Zustand pour gérer l'état de la vidéo
export const useBackgroundVideoStore = create<BackgroundVideoStore>((set) => ({
  isPlaying: false,
  playDirection: 'forward',
  startVideo: (direction) => {
    console.log('Démarrage de la vidéo:', direction);
    set({ isPlaying: true, playDirection: direction });
  },
  pauseVideo: () => set({ isPlaying: false }),
  resetVideo: () => set({ isPlaying: false, playDirection: 'forward' }),
}));

interface BackgroundVideoControllerProps {
  videoSrc: string;
}

const BackgroundVideoController: React.FC<BackgroundVideoControllerProps> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isPlaying, playDirection } = useBackgroundVideoStore();
  
  // Préchargement explicite de la vidéo au montage
  useEffect(() => {
    // Précharger la vidéo avec un élément dédié
    const preloadVideo = () => {
      const videoPreload = document.createElement('video');
      videoPreload.src = videoSrc;
      videoPreload.muted = true;
      videoPreload.playsInline = true;
      videoPreload.preload = "auto";
      
      videoPreload.addEventListener('canplaythrough', () => {
        console.log("Vidéo préchargée complètement");
        // Copier les données préchargées vers notre vidéo principale
        if (videoRef.current) {
          videoRef.current.src = videoSrc;
          videoRef.current.load();
        }
      });
      
      // Lancer le préchargement
      videoPreload.load();
      
      // Essayer de stocker la vidéo dans le cache
      if ('caches' in window) {
        caches.open('video-cache').then(cache => {
          cache.add(videoSrc)
            .then(() => console.log('Vidéo mise en cache'))
            .catch(err => console.error('Erreur lors de la mise en cache:', err));
        });
      }
    };
    
    preloadVideo();
  }, [videoSrc]);
  
  // Effet pour gérer la lecture/pause de la vidéo
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleVideoLoaded = () => {
      setIsLoaded(true);
      console.log('Vidéo chargée');
    };
    
    videoElement.addEventListener('loadeddata', handleVideoLoaded);
    
    return () => {
      videoElement.removeEventListener('loadeddata', handleVideoLoaded);
    };
  }, []);
  
  // Effet pour démarrer/arrêter la vidéo
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isLoaded) return;
    
    if (isPlaying) {
      console.log('Lecture vidéo démarrée');
      videoElement.currentTime = 0;
      
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Vidéo en cours de lecture');
          })
          .catch(error => {
            console.error('Erreur de lecture vidéo:', error);
            
            // Réessayer après un léger délai (peut aider avec certaines restrictions de navigateur)
            setTimeout(() => {
              videoElement.play().catch(e => console.error('Échec du second essai de lecture:', e));
            }, 500);
          });
      }
      
      // Pause automatique après 7 secondes (durée totale de la transition)
      const timeoutId = setTimeout(() => {
        videoElement.pause();
        useBackgroundVideoStore.getState().pauseVideo();
        console.log('Vidéo mise en pause automatiquement');
      }, 7000);
      
      return () => clearTimeout(timeoutId);
    } else {
      videoElement.pause();
      console.log('Vidéo en pause');
    }
  }, [isPlaying, isLoaded]);
  
  return (
    <div className="fixed inset-0 w-full h-full z-10 overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        className="background-video w-full h-full object-cover"
        src={videoSrc}
        muted
        playsInline
        preload="auto"
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-black/80 z-[11] flex items-center justify-center">
          <div className="text-yellow-400 text-2xl">Chargement...</div>
        </div>
      )}
    </div>
  );
};

export default BackgroundVideoController;
