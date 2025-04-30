
import React, { forwardRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VideoOverlay } from './VideoOverlay';
import { useVideoLoad } from '@/hooks/useVideoLoad';
import { useVideoTransition } from '@/hooks/useVideoTransition';
import VideoElement from './VideoElement';
import ParallaxDecorations from './ParallaxDecorations';
import { useVideoPreload } from '@/hooks/useVideoPreload';

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  fallbackImage?: string;
}

const BackgroundVideo = forwardRef<HTMLVideoElement, BackgroundVideoProps>(({ 
  videoUrl = "/lovable-uploads/Video%20fond%20normale.mp4", 
  videoUrlUV = "/lovable-uploads/Video%20fond%20UV.mp4",
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png"
}, ref) => {
  const { normalVideoRef, uvVideoRef, videoAvailability } = useVideoTransition();
  const { videoError, handleVideoLoad, handleVideoError } = useVideoLoad({ fallbackImage });
  
  // Précharger les vidéos dès le chargement du composant
  const { preloadStatus, isPreloading } = useVideoPreload({
    videoUrls: [videoUrl, videoUrlUV]
  });
  
  // Surveiller l'état de préchargement pour le débogage
  useEffect(() => {
    if (!isPreloading) {
      console.log("État de préchargement des vidéos:", preloadStatus);
      
      // Afficher des avertissements si les vidéos ne sont pas disponibles
      if (preloadStatus[videoUrl] === false) {
        console.warn(`⚠️ La vidéo normale n'est pas disponible: ${videoUrl}`);
      }
      
      if (preloadStatus[videoUrlUV] === false) {
        console.warn(`⚠️ La vidéo UV n'est pas disponible: ${videoUrlUV}`);
      }
    }
  }, [isPreloading, preloadStatus, videoUrl, videoUrlUV]);
  
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
      
      {/* Normal mode video */}
      <VideoElement
        ref={normalVideoRef}
        className="background-video video-normal"
        src={videoUrl}
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        fallbackImage={fallbackImage}
        autoRetry={true}
      />
      
      {/* UV mode video */}
      <VideoElement
        ref={uvVideoRef}
        className="background-video video-uv"
        src={videoUrlUV}
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        fallbackImage={fallbackImage}
        autoRetry={true}
      />
      
      {/* Video overlay */}
      <VideoOverlay />
      
      {/* Decorative parallax elements */}
      <ParallaxDecorations />
    </motion.div>
  );
});

BackgroundVideo.displayName = 'BackgroundVideo';

export default BackgroundVideo;
