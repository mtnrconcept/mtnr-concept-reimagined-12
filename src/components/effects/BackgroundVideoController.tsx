
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
  
  // Fonction optimisée pour lire la vidéo en sens inverse avec fallback
  const manualReverseRef = useRef<(v: HTMLVideoElement) => void>();
  manualReverseRef.current = (v: HTMLVideoElement) => {
    let last = performance.now();
    v.pause();
    v.currentTime = v.currentTime || v.duration;
    
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      v.currentTime = Math.max(0, v.currentTime - dt);
      if (v.currentTime > 0) requestAnimationFrame(step);
    };
    
    requestAnimationFrame((t) => { 
      last = t; 
      step(t); 
    });
  };
  
  // Effet pour gérer la lecture/pause de la vidéo
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isPlaying) {
      if (playDirection === 'forward') {
        console.log("Démarrage de la vidéo en avant");
        videoElement.currentTime = 0;
        videoElement.playbackRate = 1;
        videoElement.play().catch(err => {
          console.error("Erreur de lecture vidéo:", err);
        });
      } else {
        console.log("Démarrage de la vidéo en arrière");
        // Positionner à la fin pour lecture inversée
        const dur = videoElement.duration || 7;
        videoElement.currentTime = dur;
        
        try {
          // Essayer d'utiliser playbackRate négatif (peut ne pas être supporté)
          videoElement.playbackRate = -1;
          videoElement.play().catch(err => {
            console.error("Erreur de lecture vidéo inversée:", err);
            // Fallback: lecture inversée manuelle
            if (manualReverseRef.current) {
              manualReverseRef.current(videoElement);
            }
          });
        } catch (err) {
          console.log("PlaybackRate négatif non supporté, utilisation fallback");
          // Fallback: lecture inversée manuelle
          if (manualReverseRef.current) {
            manualReverseRef.current(videoElement);
          }
        }
      }
      
      // Mettre en pause automatiquement à la fin de la vidéo (après 7s)
      const timeoutId = setTimeout(() => {
        console.log("Timeout 7s écoulé, mise en pause de la vidéo");
        videoElement.pause();
        useBackgroundVideoStore.getState().pauseVideo();
      }, 7000);
      
      return () => clearTimeout(timeoutId);
    } else {
      console.log("Mise en pause de la vidéo de fond");
      videoElement.pause();
    }
  }, [isPlaying, playDirection]);
  
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${playDirection === 'reverse' ? 'video-playing-reverse' : 'video-playing-forward'}`}
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
