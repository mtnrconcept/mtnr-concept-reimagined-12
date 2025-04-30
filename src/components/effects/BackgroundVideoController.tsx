
import React, { useRef, useEffect, useState } from 'react';
import { create } from 'zustand';

interface BackgroundVideoStore {
  isPlaying: boolean;
  startVideo: () => void;
  pauseVideo: () => void;
  resetVideo: () => void;
}

// Création d'un store Zustand pour gérer l'état de la vidéo de manière globale
export const useBackgroundVideoStore = create<BackgroundVideoStore>((set) => ({
  isPlaying: false,
  startVideo: () => set({ isPlaying: true }),
  pauseVideo: () => set({ isPlaying: false }),
  resetVideo: () => set({ isPlaying: false }),
}));

interface BackgroundVideoControllerProps {
  videoSrc: string;
}

const BackgroundVideoController: React.FC<BackgroundVideoControllerProps> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isPlaying } = useBackgroundVideoStore();
  
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      // Fonction pour marquer le chargement
      const handleLoaded = () => {
        setIsLoaded(true);
        console.log("Vidéo de fond chargée");
      };
      
      videoElement.addEventListener('loadeddata', handleLoaded);
      
      return () => {
        videoElement.removeEventListener('loadeddata', handleLoaded);
      };
    }
  }, []);
  
  // Effet pour gérer la lecture/pause de la vidéo
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isPlaying) {
      console.log("Démarrage de la vidéo de fond");
      videoElement.currentTime = 0;
      videoElement.play().catch(err => {
        console.error("Erreur de lecture vidéo:", err);
      });
      
      // Mettre en pause automatiquement à la fin de la vidéo
      const handleEnded = () => {
        console.log("Vidéo terminée, mise en pause");
        useBackgroundVideoStore.getState().pauseVideo();
      };
      
      videoElement.addEventListener('ended', handleEnded);
      return () => videoElement.removeEventListener('ended', handleEnded);
    } else {
      console.log("Mise en pause de la vidéo de fond");
      videoElement.pause();
    }
  }, [isPlaying]);
  
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
