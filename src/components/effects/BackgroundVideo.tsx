
import React, { forwardRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VideoOverlay } from './VideoOverlay';
import { useVideoLoad } from '@/hooks/useVideoLoad';
import { useVideoTransition } from '@/hooks/useVideoTransition';
import VideoElement from './VideoElement';
import ParallaxDecorations from './ParallaxDecorations';
import { useVideoPreload } from '@/hooks/useVideoPreload';
import { useUVMode } from './UVModeContext';

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  fallbackImage?: string;
}

const BackgroundVideo = forwardRef<HTMLVideoElement, BackgroundVideoProps>(({ 
  videoUrl = "/lovable-uploads/Videofondnormale.mp4", 
  videoUrlUV = "/lovable-uploads/VideofondUV.mp4",
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png"
}, ref) => {
  const { normalVideoRef, uvVideoRef, videoAvailability } = useVideoTransition();
  const { videoError, handleVideoLoad, handleVideoError } = useVideoLoad({ fallbackImage });
  const { uvMode } = useUVMode();
  
  return (
    <motion.div 
      className="fixed inset-0 w-full h-full z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Fallback image if video error */}
      {videoError && (
        <img 
          src={fallbackImage} 
          alt="Background fallback" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* On utilise des conditions pour n'afficher que la vidéo active */}
      {/* afin de réduire le nombre d'éléments vidéo dans le DOM */}
      {!uvMode && (
        <VideoElement
          ref={normalVideoRef}
          className="background-video video-normal"
          src={videoUrl}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          fallbackImage={fallbackImage}
          autoRetry={true}
        />
      )}
      
      {/* UV mode video - chargé uniquement quand nécessaire */}
      {uvMode && (
        <VideoElement
          ref={uvVideoRef}
          className="background-video video-uv"
          src={videoUrlUV}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          fallbackImage={fallbackImage}
          autoRetry={true}
        />
      )}
      
      {/* Video overlay */}
      <VideoOverlay />
      
      {/* Decorative parallax elements */}
      <ParallaxDecorations />
    </motion.div>
  );
});

BackgroundVideo.displayName = 'BackgroundVideo';

export default BackgroundVideo;
