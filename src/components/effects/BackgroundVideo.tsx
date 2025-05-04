
import React from 'react';
import VideoContainer from './video/VideoContainer';

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ 
  videoUrl = "/lovable-uploads/videonormale.mp4", 
  videoUrlUV = "/lovable-uploads/videouv.mp4"
}) => {
  return <VideoContainer videoUrl={videoUrl} videoUrlUV={videoUrlUV} />;
};

export default BackgroundVideo;
