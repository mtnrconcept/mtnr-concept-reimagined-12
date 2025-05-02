
import React, { useEffect, useRef, useState } from "react";
import { useUVMode } from "./UVModeContext";
import { useLocation } from "react-router-dom";
import { useNavigation } from "./NavigationContext";

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
  const { isTransitioning } = useNavigation();
  const [isPlaying, setIsPlaying] = useState(false);
  const lastLocationRef = useRef(location.pathname);

  // Effect to handle video playback when location changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if location has changed - only then trigger transition
    if (lastLocationRef.current !== location.pathname) {
      console.log("Location changed: triggering video transition");
      
      // Update the reference
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
      
      setIsPlaying(true);
      
      // Start playback
      video.play().then(() => {
        console.log("Transition video playback started");
        
        // Listen for video end
        const handleEnded = () => {
          console.log("Video transition completed");
          video.loop = true; // Set back to looping after transition
          video.play().catch(err => {
            console.error("Failed to restart loop:", err);
          });
          video.removeEventListener('ended', handleEnded);
          setIsPlaying(false);
        };
        
        video.addEventListener('ended', handleEnded, { once: true });
      }).catch(err => {
        console.error("Failed to play transition video:", err);
        setIsPlaying(false);
        handleVideoError();
      });
    } else if (!isPlaying) {
      // Normal background video (non-transition)
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
  }, [currentVideoUrl, location.pathname, isPlaying]);

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
          className={`w-full h-full object-cover ${isTransitioning || isPlaying ? 'video-transitioning' : ''}`}
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
