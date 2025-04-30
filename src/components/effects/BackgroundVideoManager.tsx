
import { create } from 'zustand';
import { useEffect, useRef } from 'react';

// Define the store for managing video state
export interface VideoStore {
  activeMode: 'normal' | 'uv';
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  setMode: (mode: 'normal' | 'uv') => void;
}

// Create the store with initial state and actions
export const useVideoStore = create<VideoStore>((set) => ({
  activeMode: 'normal',
  isPlaying: false,
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setMode: (mode) => set({ activeMode: mode }),
}));

// Component for managing the background videos
export const BackgroundVideoManager = () => {
  const normalVideoRef = useRef<HTMLVideoElement>(null);
  const uvVideoRef = useRef<HTMLVideoElement>(null);
  
  const { activeMode, isPlaying } = useVideoStore();
  const store = useVideoStore();

  useEffect(() => {
    // Control video playback based on isPlaying state
    if (isPlaying) {
      const activeVideoRef = activeMode === 'normal' ? normalVideoRef : uvVideoRef;
      if (activeVideoRef.current) {
        activeVideoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
        });
      }
    } else {
      // Pause both videos
      if (normalVideoRef.current) normalVideoRef.current.pause();
      if (uvVideoRef.current) uvVideoRef.current.pause();
    }
  }, [isPlaying, activeMode]);

  // Handle video ended event
  const handleVideoEnded = () => {
    store.pause();
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Normal Mode Video */}
      <video
        ref={normalVideoRef}
        src="/lovable-uploads/Video fond normale.mp4"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${activeMode === 'normal' ? 'opacity-100' : 'opacity-0'}`}
        muted
        playsInline
        onEnded={handleVideoEnded}
      />
      
      {/* UV Mode Video */}
      <video
        ref={uvVideoRef}
        src="/lovable-uploads/Video fond UV.mp4"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${activeMode === 'uv' ? 'opacity-100' : 'opacity-0'}`}
        muted
        playsInline
        onEnded={handleVideoEnded}
      />
    </div>
  );
};
