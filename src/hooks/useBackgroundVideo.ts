
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUVMode } from '@/components/effects/UVModeContext';
import { useTorch } from '@/components/effects/TorchContext';

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { uvMode } = useUVMode();
  const { isTorchActive } = useTorch();
  
  // States
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasUserInteraction, setHasUserInteraction] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Constants
  const maxRetries = 3;
  
  // Determine current video URL based on UV mode
  const currentVideo = useMemo(() => {
    return uvMode ? videoUrlUV : videoUrl;
  }, [uvMode, videoUrl, videoUrlUV]);

  // Function to handle user interaction
  const handleUserInteraction = useCallback(() => {
    if (!hasUserInteraction) {
      console.log('User interaction detected, video ready to play');
      setHasUserInteraction(true);
      
      // Attempt to play video after interaction
      if (videoRef.current && !videoError) {
        videoRef.current.play().catch(err => {
          console.error("Error during initial playback:", err);
        });
      }
    }
  }, [hasUserInteraction, videoError]);

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

  // Function to retry video playback
  const retryVideo = useCallback(() => {
    setVideoError(false);
    setRetryCount(0);
  }, []);

  // Video transition function
  const playVideoTransition = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || videoError) {
      console.error("Error: video element not available or video error");
      return;
    }
    
    try {
      setIsTransitioning(true);
      setIsPlaying(true);
      
      // Update video attributes
      videoElement.src = currentVideo;
      videoElement.load();
      
      // Configure event handlers
      const playPromise = new Promise<void>((resolve, reject) => {
        const onCanPlay = () => {
          videoElement.removeEventListener('canplay', onCanPlay);
          videoElement.removeEventListener('error', onError);
          
          // Try to play the video
          videoElement.play()
            .then(() => {
              console.log("Video is now playing");
              resolve();
            })
            .catch(error => {
              console.error("Playback error:", error);
              reject(error);
            });
        };
        
        const onError = () => {
          videoElement.removeEventListener('canplay', onCanPlay);
          videoElement.removeEventListener('error', onError);
          reject(new Error("Video loading error"));
        };
        
        videoElement.addEventListener('canplay', onCanPlay, { once: true });
        videoElement.addEventListener('error', onError, { once: true });
        
        // Safety timeout
        setTimeout(() => {
          videoElement.removeEventListener('canplay', onCanPlay);
          videoElement.removeEventListener('error', onError);
          reject(new Error("Loading timeout exceeded"));
        }, 5000);
      });
      
      // Wait for playback or catch errors
      try {
        await playPromise;
        
        // Add listener for video end
        const handleVideoEnded = () => {
          console.log("Video ended");
          setIsTransitioning(false);
          setIsPlaying(false);
          videoElement.removeEventListener('ended', handleVideoEnded);
          
          // Resume looping after transition
          videoElement.loop = true;
          videoElement.play().catch(e => console.error("Error resuming loop:", e));
        };
        
        videoElement.removeEventListener('ended', handleVideoEnded);
        videoElement.addEventListener('ended', handleVideoEnded);
        
      } catch (error) {
        console.error("Video playback error:", error);
        setIsTransitioning(false);
        setIsPlaying(false);
        handleVideoError();
      }
    } catch (error) {
      console.error("General error during video transition:", error);
      setIsTransitioning(false);
      setIsPlaying(false);
    }
  }, [currentVideo, videoError, handleVideoError]);

  // Reset retry count when video URL changes
  useEffect(() => {
    setRetryCount(0);
  }, [currentVideo]);
  
  // Initial video setup
  useEffect(() => {
    if (videoRef.current && isFirstLoad === false) {
      const autoplayAttempt = async () => {
        try {
          await videoRef.current?.play();
          console.log("Autoplay successful");
        } catch (error) {
          console.warn("Autoplay failed, waiting for interaction:", error);
        }
      };
      
      autoplayAttempt();
    }
  }, [videoRef, isFirstLoad]);

  return {
    videoRef,
    isFirstLoad,
    setIsFirstLoad,
    isTransitioning,
    setIsTransitioning,
    hasUserInteraction,
    setHasUserInteraction,
    currentVideo,
    handleUserInteraction,
    playVideoTransition,
    uvMode,
    isTorchActive,
    videoError,
    isPlaying,
    retryVideo,
    fallbackImage
  };
};
