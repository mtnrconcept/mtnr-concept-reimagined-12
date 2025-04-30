
import React, { createContext, useContext, useRef } from 'react';

interface VideoRefContextType {
  registerVideoRef: (ref: React.RefObject<HTMLVideoElement>, isUVVideo?: boolean) => void;
  normalVideoRef: React.RefObject<HTMLVideoElement>;
  uvVideoRef: React.RefObject<HTMLVideoElement>;
}

const VideoRefContext = createContext<VideoRefContextType | null>(null);

export const VideoRefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const normalVideoRef = useRef<HTMLVideoElement>(null);
  const uvVideoRef = useRef<HTMLVideoElement>(null);
  
  const registerVideoRef = React.useCallback((ref: React.RefObject<HTMLVideoElement>, isUVVideo = false) => {
    if (isUVVideo) {
      if (ref.current) uvVideoRef.current = ref.current;
    } else {
      if (ref.current) normalVideoRef.current = ref.current;
    }
    console.log(`Référence vidéo ${isUVVideo ? 'UV' : 'normale'} enregistrée`);
  }, []);

  return (
    <VideoRefContext.Provider
      value={{
        registerVideoRef,
        normalVideoRef,
        uvVideoRef
      }}
    >
      {children}
    </VideoRefContext.Provider>
  );
};

export const useVideoRef = () => {
  const context = useContext(VideoRefContext);
  if (!context) {
    throw new Error('useVideoRef doit être utilisé à l\'intérieur d\'un VideoRefProvider');
  }
  return context;
};
