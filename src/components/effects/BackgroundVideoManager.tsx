
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { create } from 'zustand';

// Define the type of video we can show
export type VideoType = 'normal' | 'uv';

// Define the store for managing the video state
interface VideoStore {
  activeVideo: VideoType;
  isPlaying: boolean;
  setActiveVideo: (type: VideoType) => void;
  playVideo: () => void;
  pauseVideo: () => void;
}

// Create a Zustand store for managing video state
export const useVideoStore = create<VideoStore>((set) => ({
  activeVideo: 'normal',
  isPlaying: false,
  setActiveVideo: (type) => set({ activeVideo: type }),
  playVideo: () => set({ isPlaying: true }),
  pauseVideo: () => set({ isPlaying: false })
}));

// Props for the BackgroundVideoManager component
interface BackgroundVideoManagerProps {
  normalVideoSrc: string;
  uvVideoSrc: string;
}

const BackgroundVideoManager: React.FC<BackgroundVideoManagerProps> = ({
  normalVideoSrc,
  uvVideoSrc
}) => {
  // Get state from the store
  const { activeVideo, isPlaying, setActiveVideo } = useVideoStore();
  
  // Refs for the video elements
  const normalVideoRef = useRef<HTMLVideoElement>(null);
  const uvVideoRef = useRef<HTMLVideoElement>(null);

  // Effect to pause/play videos based on the active state
  useEffect(() => {
    const normalVideo = normalVideoRef.current;
    const uvVideo = uvVideoRef.current;
    
    if (!normalVideo || !uvVideo) return;

    if (isPlaying) {
      if (activeVideo === 'normal') {
        normalVideo.play().catch(err => console.error('Error playing normal video:', err));
        uvVideo.pause();
      } else {
        uvVideo.play().catch(err => console.error('Error playing UV video:', err));
        normalVideo.pause();
      }
    } else {
      normalVideo.pause();
      uvVideo.pause();
    }
  }, [activeVideo, isPlaying]);

  // Effect to handle page changes and start videos
  useEffect(() => {
    const triggerVideoOnPathChange = () => {
      useVideoStore.getState().playVideo();
    };

    // Listen for route changes (simplified implementation)
    window.addEventListener('popstate', triggerVideoOnPathChange);
    
    // Initial trigger when the component mounts
    triggerVideoOnPathChange();
    
    return () => {
      window.removeEventListener('popstate', triggerVideoOnPathChange);
    };
  }, []);

  const handleVideoEnd = () => {
    useVideoStore.getState().pauseVideo();
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Normal video */}
      <video
        ref={normalVideoRef}
        src={normalVideoSrc}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          activeVideo === 'normal' ? 'opacity-100' : 'opacity-0'
        }`}
        muted
        playsInline
        loop={false}
        onEnded={handleVideoEnd}
      />
      
      {/* UV video */}
      <video
        ref={uvVideoRef}
        src={uvVideoSrc}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          activeVideo === 'uv' ? 'opacity-100' : 'opacity-0'
        }`}
        muted
        playsInline
        loop={false}
        onEnded={handleVideoEnd}
      />
    </div>
  );
};

export default BackgroundVideoManager;
