
import React from "react";
import { useBackgroundVideo } from "@/hooks/useBackgroundVideo";
import { useVideoTransitionEffects } from "@/hooks/useVideoTransitionEffects";

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  fallbackImage?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoUrl = "/lovable-uploads/Videofondnormale.mp4",
  videoUrlUV = "/lovable-uploads/VideofondUV.mp4",
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png",
}) => {
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
    fallbackImage: fallbackImageFromHook
  } = backgroundVideo;
  
  // Set up video transition effects
  useVideoTransitionEffects(backgroundVideo);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden">
      {!videoError ? (
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${isTransitioning || isPlaying ? 'video-transitioning' : ''}`}
          onError={() => console.error("Video error occurred")}
          muted
          playsInline
        />
      ) : (
        <div className="video-fallback-container">
          <img
            src={fallbackImageFromHook}
            alt="Fallback Background"
            className="w-full h-full object-cover"
          />
          <button 
            onClick={retryVideo}
            className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-md text-sm"
          >
            Retry Video
          </button>
        </div>
      )}
    </div>
  );
};
