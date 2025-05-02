
import React, { useEffect } from "react";
import { useBackgroundVideo } from "@/hooks/useBackgroundVideo";
import { useVideoTransitionEffects } from "@/hooks/useVideoTransitionEffects";
import { useTorch } from "./TorchContext";

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  fallbackImage?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoUrl = "/lovable-uploads/video-fond-normale.mp4",
  videoUrlUV = "/lovable-uploads/video-fond-UV.mp4",
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png",
}) => {
  const { isTorchActive } = useTorch();
  
  const backgroundVideo = useBackgroundVideo({
    videoUrl,
    videoUrlUV,
    fallbackImage
  });
  
  const {
    videoRef,
    videoError,
    isPlaying,
    isTransitioning,
    retryVideo,
    setVideoError,
    fallbackImage: fallbackImageFromHook
  } = backgroundVideo;
  
  // Setup video transition effects using the unified hook
  useVideoTransitionEffects(backgroundVideo);

  // Additional error handler with retry logic
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleLoadedData = () => {
      console.log("✅ Vidéo chargée avec succès");
    };
    
    const handleError = (e: Event) => {
      console.error("❌ Erreur lors du chargement de la vidéo:", e);
      setVideoError(true);
    };
    
    // Add event listeners
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('error', handleError);
    
    return () => {
      // Cleanup event listeners
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('error', handleError);
    };
  }, [videoRef, setVideoError]);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden">
      {!videoError ? (
        <video
          ref={videoRef}
          className={`w-full h-full object-cover background-video ${isTransitioning || isPlaying ? 'video-transitioning' : ''}`}
          onError={() => console.error("Video error occurred")}
          muted
          playsInline
          autoPlay
          loop
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          preload="auto"
        />
      ) : (
        <div className="video-fallback-container">
          <img
            src={fallbackImageFromHook}
            alt="Fallback Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center p-4 rounded-lg bg-black/80 max-w-md">
              <p className="text-white mb-4">Impossible de charger la vidéo</p>
              <button 
                onClick={retryVideo}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-md transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
