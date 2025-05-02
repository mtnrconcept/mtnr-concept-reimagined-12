
import { useEffect, useRef, useState, useCallback } from "react";
import { useUVMode } from "@/components/effects/UVModeContext";
import { useLocation } from "react-router-dom";
import { useNavigation } from "@/components/effects/NavigationContext";

interface UseBackgroundVideoProps {
  videoUrl: string;
  videoUrlUV: string;
  fallbackImage?: string;
}

export const useBackgroundVideo = ({
  videoUrl,
  videoUrlUV,
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png"
}: UseBackgroundVideoProps) => {
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

  // Handle video errors with retry logic
  const handleVideoError = useCallback(() => {
    if (retryCount < maxRetries) {
      console.log(`Retrying video playback (${retryCount + 1}/${maxRetries})...`);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 1000);
    } else {
      console.error("Max retries reached, falling back to image");
      setVideoError(true);
    }
  }, [retryCount, maxRetries]);

  // Reset retry count when video URL changes
  useEffect(() => {
    setRetryCount(0);
  }, [currentVideoUrl]);

  // Handle video playback when location changes
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
  }, [currentVideoUrl, location.pathname, isPlaying, handleVideoError]);

  // Function to retry video playback
  const retryVideo = useCallback(() => {
    setVideoError(false);
    setRetryCount(0);
  }, []);

  return {
    videoRef,
    videoError,
    isPlaying,
    isTransitioning,
    retryVideo,
    fallbackImage
  };
};
