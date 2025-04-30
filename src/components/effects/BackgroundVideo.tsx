
import React, { useEffect, useRef } from 'react';
import { useBackgroundVideoStore } from './BackgroundVideoController';

interface BackgroundVideoProps {
  videoSrc: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ videoSrc }) => {
  const { isPlaying } = useBackgroundVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Effect to play/pause video based on isPlaying state
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isPlaying) {
      videoElement.currentTime = 0; // Reset to beginning
      videoElement.play().catch(err => {
        console.error("Error playing video:", err);
      });
    } else {
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
    </div>
  );
};

export default BackgroundVideo;
