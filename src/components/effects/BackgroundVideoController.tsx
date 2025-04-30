
import React, { useRef, useEffect, useState } from 'react';
import { create } from 'zustand';

interface BackgroundVideoStore {
  isPlaying: boolean;
  playDirection: 'forward' | 'reverse';
  startVideo: (direction: 'forward' | 'reverse') => void;
  pauseVideo: () => void;
  resetVideo: () => void;
}

// Création d'un store Zustand pour gérer l'état de la vidéo de manière globale
export const useBackgroundVideoStore = create<BackgroundVideoStore>((set) => ({
  isPlaying: false,
  playDirection: 'forward',
  startVideo: (direction) => set({ isPlaying: true, playDirection: direction }),
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
  
  // Précharger la vidéo dès le début
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      // Fonction pour marquer le chargement
      const handleLoaded = () => {
        setIsLoaded(true);
        console.log("Vidéo de fond chargée");
        
        // Précharger la vidéo en mémoire en la lisant puis la mettant en pause immédiatement
        videoElement.play().then(() => {
          videoElement.pause();
          videoElement.currentTime = 0;
        }).catch(err => {
          console.log("Préchargement vidéo silencieux échoué:", err);
        });
      };
      
      videoElement.addEventListener('loadeddata', handleLoaded);
      
      return () => {
        videoElement.removeEventListener('loadeddata', handleLoaded);
      };
    }
  }, []);
  
  // Effet pour gérer la lecture/pause de la vidéo avec optimisations
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isPlaying) {
      console.log("Démarrage de la vidéo en avant (optimisé)");
      videoElement.currentTime = 0;
      videoElement.playbackRate = 1;
      
      // Utiliser un catch silencieux pour éviter les erreurs dans la console
      videoElement.play().catch(() => {});
      
      // Mettre en pause automatiquement à la fin de la vidéo
      const timeoutId = setTimeout(() => {
        console.log("Animation terminée, mise en pause de la vidéo");
        videoElement.pause();
        useBackgroundVideoStore.getState().pauseVideo();
      }, 7000); // Durée totale de la transition
      
      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      // Pause
      console.log("Mise en pause de la vidéo de fond");
      videoElement.pause();
    }
  }, [isPlaying, playDirection]);
  
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={videoSrc}
        muted
        playsInline
        preload="auto"
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-black z-[1] flex items-center justify-center">
          <div className="text-yellow-400 text-2xl">Chargement...</div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
    </div>
  );
};

export default BackgroundVideoController;
