
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
}

const BackgroundVideo = forwardRef<HTMLVideoElement, BackgroundVideoProps>(({ 
  videoUrl = "/lovable-uploads/Videofondnormale.mp4", 
  videoUrlUV = "/lovable-uploads/VideofondUV.mp4"
}, ref) => {
  const { normalVideoRef, uvVideoRef, videoAvailability } = useVideoTransition();
  const { videoError, handleVideoLoad, handleVideoError } = useVideoLoad();
  const { uvMode } = useUVMode();
  
  // Préchargement des vidéos pour une meilleure performance
  const { preloadStatus } = useVideoPreload({
    videoUrls: [videoUrl, videoUrlUV],
    sequential: true,
    onPreloadComplete: (results) => {
      console.log("Préchargement vidéo terminé:", results);
    }
  });
  
  useEffect(() => {
    // Log pour le débogage
    console.log("BackgroundVideo monté, URLs vidéos:", { videoUrl, videoUrlUV });
    console.log("Mode UV actif:", uvMode);
  }, [videoUrl, videoUrlUV, uvMode]);
  
  return (
    <motion.div 
      className="fixed inset-0 w-full h-full z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* On utilise des conditions pour n'afficher que la vidéo active */}
      {/* afin de réduire le nombre d'éléments vidéo dans le DOM */}
      {!uvMode && (
        <VideoElement
          ref={normalVideoRef}
          className="background-video video-normal absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          autoRetry={true}
        />
      )}
      
      {/* UV mode video - chargé uniquement quand nécessaire */}
      {uvMode && (
        <VideoElement
          ref={uvVideoRef}
          className="background-video video-uv absolute inset-0 w-full h-full object-cover"
          src={videoUrlUV}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
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
