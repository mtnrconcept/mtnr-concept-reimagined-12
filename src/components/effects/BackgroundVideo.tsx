
import React, { useEffect, useRef, useState } from "react";
import { useUVMode } from "./UVModeContext";
import { useLocation } from "react-router-dom";

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  fallbackImage?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoUrl = "/lovable-uploads/Video fond normale.mp4",
  videoUrlUV = "/lovable-uploads/Video fond UV.mp4",
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const { uvMode } = useUVMode();
  const location = useLocation();
  const currentVideoUrl = uvMode ? videoUrlUV : videoUrl;
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastLocationRef = useRef(location.pathname);

  // Effect to handle video playback when URL or UV mode changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if location has changed - only then trigger transition
    if (lastLocationRef.current !== location.pathname) {
      console.log("Location changed: triggering video transition");
      setIsTransitioning(true);
      lastLocationRef.current = location.pathname;
      
      // First pause and reset the video
      video.pause();
      video.currentTime = 0;
      
      // Configure and play video
      video.src = currentVideoUrl;
      video.load();
      video.muted = true;
      video.playsInline = true;
      video.loop = false;  // Don't loop during transition
      
      // Start playback with delay to ensure proper loading
      setTimeout(() => {
        video.play().then(() => {
          console.log("Transition video playback started");
          
          // After video duration, return to looping state
          const transitionEndTimeout = setTimeout(() => {
            video.loop = true;
            setIsTransitioning(false);
            console.log("Video transition completed, returning to loop mode");
          }, 7000); // 7 seconds - the length of the video
          
          return () => clearTimeout(transitionEndTimeout);
        }).catch(err => {
          console.error("Failed to play transition video:", err);
          setIsTransitioning(false);
          handleVideoError();
        });
      }, 100);
    } else if (!isTransitioning) {
      // Normal (non-transition) video setup
      video.src = currentVideoUrl;
      video.load();
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.play().catch(err => {
        console.error("Failed to play background video:", err);
        handleVideoError();
      });
    }
    
    return () => {
      if (video) {
        video.pause();
      }
    };
  }, [currentVideoUrl, location.pathname, isTransitioning]);

  // Handle video errors with retry logic
  const handleVideoError = () => {
    if (retryCount < maxRetries) {
      console.log(`Retrying video playback (${retryCount + 1}/${maxRetries})...`);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 1000);
    } else {
      console.error("Max retries reached, falling back to image");
      setVideoError(true);
    }
  };

  // Reset retry count when video URL changes
  useEffect(() => {
    setRetryCount(0);
  }, [currentVideoUrl]);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden">
      {!videoError ? (
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${isTransitioning ? 'video-transitioning' : ''}`}
          onError={() => handleVideoError()}
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
