
import React, { useEffect, useRef, useState } from "react";
import { useUVMode } from "./UVModeContext";
import { useLocation } from "react-router-dom";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const { uvMode } = useUVMode();
  const location = useLocation();
  const currentVideoUrl = uvMode ? videoUrlUV : videoUrl;
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Effect to handle video playback when URL changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.src = currentVideoUrl;
        video.load();
        
        // Configure video properties
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        video.autoplay = true;
        
        await video.play();
        console.log("Video playback started successfully");
        setVideoError(false);
      } catch (err) {
        console.warn("Video autoplay failed:", err);
        
        // Retry logic
        if (retryCount < maxRetries) {
          console.log(`Retrying video playback (${retryCount + 1}/${maxRetries})...`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1000);
        } else {
          console.error("Max retries reached, falling back to image");
          setVideoError(true);
        }
      }
    };

    playVideo();
    
    // Reset retry count when URL changes
    return () => {
      setRetryCount(0);
    };
  }, [currentVideoUrl, location.pathname, retryCount, maxRetries]);

  // Handle video errors
  const handleVideoError = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video loading error:", event);
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 1000);
    } else {
      setVideoError(true);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden">
      {!videoError ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onError={handleVideoError}
          muted
          playsInline
        />
      ) : (
        <div className="video-fallback-container">
          <img
            src={fallbackImage}
            alt="Fallback Background"
            className="w-full h-full object-cover"
          />
          <button 
            onClick={() => {
              setVideoError(false);
              setRetryCount(0);
            }}
            className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-md text-sm"
          >
            Retry Video
          </button>
        </div>
      )}
    </div>
  );
};
