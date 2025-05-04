
import React from 'react';
import VideoContainer from './video/VideoContainer';
import { useUVMode } from './UVModeContext';

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  className?: string;
}

export default function BackgroundVideo({ 
  videoUrl = "/lovable-uploads/videonormale.mp4",
  videoUrlUV = "/lovable-uploads/videouv.mp4",
  className = ""
}: BackgroundVideoProps) {
  return (
    <VideoContainer 
      videoUrl={videoUrl}
      videoUrlUV={videoUrlUV}
    />
  );
}
