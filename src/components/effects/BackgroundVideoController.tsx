
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
  
  // Référence pour la lecture en sens inverse avec optimisations
  const reversePlaybackRef = useRef({
    rafId: 0,
    lastTimestamp: 0,
    isPlaying: false
  });
  
  // Fonction optimisée pour lire la vidéo en sens inverse avec performances améliorées
  const playInReverse = (videoElement: HTMLVideoElement) => {
    if (!videoElement) return;
    
    // Annuler l'animation précédente si elle existe
    if (reversePlaybackRef.current.rafId) {
      cancelAnimationFrame(reversePlaybackRef.current.rafId);
    }
    
    // Réinitialiser l'état
    reversePlaybackRef.current = {
      rafId: 0,
      lastTimestamp: performance.now(),
      isPlaying: true
    };
    
    // S'assurer que la vidéo commence par la fin
    videoElement.currentTime = videoElement.duration || 7;
    videoElement.pause();
    
    const step = (now: number) => {
      if (!reversePlaybackRef.current.isPlaying) return;
      
      const dt = (now - reversePlaybackRef.current.lastTimestamp) / 1000;
      reversePlaybackRef.current.lastTimestamp = now;
      
      // Réduire le temps courant avec un taux de lecture contrôlé
      videoElement.currentTime = Math.max(0, videoElement.currentTime - dt);
      
      // Continuer la lecture si pas à la fin
      if (videoElement.currentTime > 0 && reversePlaybackRef.current.isPlaying) {
        reversePlaybackRef.current.rafId = requestAnimationFrame(step);
      } else {
        reversePlaybackRef.current.isPlaying = false;
      }
    };
    
    // Démarrer l'animation
    reversePlaybackRef.current.rafId = requestAnimationFrame(step);
  };
  
  // Effet pour gérer la lecture/pause de la vidéo avec optimisations
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isPlaying) {
      // Arrêter toute lecture inversée précédente
      reversePlaybackRef.current.isPlaying = false;
      if (reversePlaybackRef.current.rafId) {
        cancelAnimationFrame(reversePlaybackRef.current.rafId);
      }
      
      if (playDirection === 'forward') {
        console.log("Démarrage de la vidéo en avant (optimisé)");
        videoElement.currentTime = 0;
        videoElement.playbackRate = 1;
        
        // Utiliser un catch silencieux pour éviter les erreurs dans la console
        videoElement.play().catch(() => {});
      } else {
        console.log("Démarrage de la vidéo en arrière (optimisé)");
        
        try {
          // Essayer d'abord avec playbackRate négatif (meilleure performance)
          videoElement.playbackRate = -1;
          videoElement.currentTime = videoElement.duration || 7;
          videoElement.play().catch(() => {
            // Fallback au mode manuel si l'API ne supporte pas la lecture inversée
            playInReverse(videoElement);
          });
        } catch (err) {
          // Fallback au mode manuel si l'API ne supporte pas la lecture inversée
          playInReverse(videoElement);
        }
      }
      
      // Mettre en pause automatiquement à la fin de la vidéo
      const timeoutId = setTimeout(() => {
        console.log("Animation terminée, mise en pause de la vidéo");
        videoElement.pause();
        reversePlaybackRef.current.isPlaying = false;
        useBackgroundVideoStore.getState().pauseVideo();
      }, 7000);
      
      return () => {
        clearTimeout(timeoutId);
        reversePlaybackRef.current.isPlaying = false;
        if (reversePlaybackRef.current.rafId) {
          cancelAnimationFrame(reversePlaybackRef.current.rafId);
        }
      };
    } else {
      // Pause
      console.log("Mise en pause de la vidéo de fond");
      videoElement.pause();
      reversePlaybackRef.current.isPlaying = false;
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
        style={{
          transform: `translateZ(0) ${playDirection === 'reverse' ? 'scaleY(-1)' : 'scaleY(1)'}`,
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
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
