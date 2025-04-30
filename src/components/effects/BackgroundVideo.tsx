
import React from 'react';
import { useBackgroundVideoStore } from './BackgroundVideoController';

interface BackgroundVideoProps {
  videoSrc: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ videoSrc }) => {
  const { isPlaying } = useBackgroundVideoStore();
  
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
      <video
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
