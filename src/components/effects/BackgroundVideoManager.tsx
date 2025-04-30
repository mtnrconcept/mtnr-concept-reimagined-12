
import React, { useRef, useEffect, useState } from 'react';
import { create } from 'zustand';

interface VideoState {
  isPlaying: boolean;
  isUVMode: boolean;
  setPlaying: (playing: boolean) => void;
  toggleUVMode: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  isPlaying: false,
  isUVMode: false,
  setPlaying: (playing) => set({ isPlaying: playing }),
  toggleUVMode: () => set((state) => ({ isUVMode: !state.isUVMode })),
}));

interface BackgroundVideoManagerProps {
  normalVideoSrc: string;
  uvVideoSrc: string;
}

const BackgroundVideoManager: React.FC<BackgroundVideoManagerProps> = ({
  normalVideoSrc,
  uvVideoSrc,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const uvVideoRef = useRef<HTMLVideoElement>(null);
  const { isPlaying, isUVMode } = useVideoStore();
  const [normalLoaded, setNormalLoaded] = useState(false);
  const [uvLoaded, setUVLoaded] = useState(false);

  // Handle video loading
  useEffect(() => {
    const normalVideo = videoRef.current;
    const uvVideo = uvVideoRef.current;

    if (normalVideo) {
      normalVideo.addEventListener('loadeddata', () => {
        console.log("Normal video loaded");
        setNormalLoaded(true);
      });
    }

    if (uvVideo) {
      uvVideo.addEventListener('loadeddata', () => {
        console.log("UV video loaded");
        setUVLoaded(true);
      });
    }

    return () => {
      if (normalVideo) {
        normalVideo.removeEventListener('loadeddata', () => setNormalLoaded(true));
      }
      if (uvVideo) {
        uvVideo.removeEventListener('loadeddata', () => setUVLoaded(true));
      }
    };
  }, []);

  // Handle playback control
  useEffect(() => {
    const video = isUVMode ? uvVideoRef.current : videoRef.current;
    
    if (!video) return;
    
    if (isPlaying) {
      console.log(`Playing ${isUVMode ? 'UV' : 'normal'} video`);
      // Reset to beginning
      video.currentTime = 0;
      
      // Play the video
      video.play().catch(err => {
        console.error("Error playing video:", err);
      });
      
      // Auto-pause at the end (after playing once)
      const onEnded = () => {
        console.log("Video playback complete");
        useVideoStore.getState().setPlaying(false);
      };
      
      video.addEventListener('ended', onEnded);
      
      return () => {
        video.removeEventListener('ended', onEnded);
      };
    } else {
      // Pause if not playing
      video.pause();
    }
  }, [isPlaying, isUVMode]);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
      {/* Normal Video */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isUVMode ? 'opacity-0' : 'opacity-100'}`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={normalVideoSrc}
          muted
          playsInline
          preload="auto"
        />
      </div>
      
      {/* UV Video */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isUVMode ? 'opacity-100' : 'opacity-0'}`}>
        <video
          ref={uvVideoRef}
          className="w-full h-full object-cover"
          src={uvVideoSrc}
          muted
          playsInline
          preload="auto"
        />
      </div>
      
      {/* Loading indicator */}
      {!normalLoaded && !uvLoaded && (
        <div className="absolute inset-0 bg-black z-[1] flex items-center justify-center">
          <div className="text-yellow-400 text-2xl">Chargement vidéo...</div>
        </div>
      )}
      
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
    </div>
  );
};

export default BackgroundVideoManager;
