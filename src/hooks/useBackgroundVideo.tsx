
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
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [hasUserInteraction, setHasUserInteraction] = useState(false);

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
    } else if (!isPlaying && isFirstLoad) {
      // Initial background video setup
      video.src = currentVideoUrl;
      video.load();
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      
      // Try to autoplay on first load
      video.play().catch(err => {
        console.error("Failed to play background video:", err);
        // Don't consider this an error, just wait for user interaction
      });
      
      setIsFirstLoad(false);
    }
    
    return () => {
      if (video) {
        // Don't pause during transitions
        if (!isTransitioning) {
          video.pause();
        }
      }
    };
  }, [currentVideoUrl, location.pathname, isPlaying, handleVideoError, isFirstLoad, isTransitioning]);

  // Handle user interaction
  const handleUserInteraction = useCallback(() => {
    if (!hasUserInteraction) {
      console.log('User interaction detected, video ready to play');
      setHasUserInteraction(true);
      
      // Attempt to play video after interaction
      if (videoRef.current && !videoError) {
        videoRef.current.play().catch(err => {
          console.error("Error during playback after interaction:", err);
        });
      }
    }
  }, [hasUserInteraction, videoError]);

  // Add listeners for first user interaction
  useEffect(() => {
    if (hasUserInteraction) return;
    
    const handleInteraction = () => {
      handleUserInteraction();
    };
    
    // Add event listeners
    const events = ['click', 'touchstart', 'keydown', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true });
    });
    
    return () => {
      // Clean up listeners
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [handleUserInteraction, hasUserInteraction]);

  // Function to retry video playback
  const retryVideo = useCallback(() => {
    setVideoError(false);
    setRetryCount(0);
    
    if (videoRef.current) {
      videoRef.current.src = currentVideoUrl;
      videoRef.current.load();
      videoRef.current.play().catch(err => {
        console.error("Retry failed:", err);
        handleVideoError();
      });
    }
  }, [currentVideoUrl, handleVideoError]);

  // Function for playing video transition
  const playVideoTransition = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = 0;
    setIsPlaying(true);
    
    try {
      await video.play();
    } catch (error) {
      console.error("Error playing transition video:", error);
      setIsPlaying(false);
    }
  }, []);

  return {
    videoRef,
    videoError,
    isPlaying,
    isTransitioning,
    isFirstLoad,
    setIsFirstLoad,
    hasUserInteraction,
    setHasUserInteraction,
    playVideoTransition,
    handleUserInteraction,
    currentVideo: currentVideoUrl,
    retryVideo,
    fallbackImage,
    uvMode
  };
};
