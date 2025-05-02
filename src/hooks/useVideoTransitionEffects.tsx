
import { useEffect } from 'react';
import { useNavigation } from '@/components/effects/NavigationContext';

export const useVideoTransitionEffects = (backgroundVideo: any) => {
  const {
    videoRef,
    isFirstLoad,
    setIsFirstLoad,
    isTransitioning,
    hasUserInteraction,
    currentVideo,
    playVideoTransition,
    handleUserInteraction,
  } = backgroundVideo;
  
  const navigation = useNavigation();

  // Execute transition if conditions are met
  const executeTransition = () => {
    if (!hasUserInteraction) {
      handleUserInteraction();
      console.log('First interaction, preparing video transition');
      setTimeout(() => playVideoTransition(), 100);
    } else if (!isTransitioning) {
      console.log('Executing video transition');
      playVideoTransition();
    }
  };

  // Listen for navigation events
  useEffect(() => {
    const unregister = navigation.registerVideoTransitionListener(() => {
      console.log("Video transition triggered by navigation");
      executeTransition();
    });
    
    return unregister;
  }, [navigation, executeTransition, hasUserInteraction, isTransitioning]);
  
  // Initialize and start video
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Initial setup
    if (isFirstLoad) {
      console.log("First loading of video");
      
      const initializeVideo = async () => {
        // Configure video
        videoElement.playsInline = true;
        videoElement.muted = true;
        videoElement.loop = true;
        videoElement.autoplay = true;
        
        // Set sources correctly if needed
        if (!videoElement.src && videoElement.getElementsByTagName('source').length === 0) {
          const source = document.createElement('source');
          source.src = currentVideo;
          source.type = 'video/mp4';
          videoElement.appendChild(source);
          videoElement.load();
        }
        
        try {
          // Attempt to play
          await videoElement.play();
          console.log("Video playback started successfully");
        } catch (error) {
          console.warn("Autoplay impossible, waiting for interaction:", error);
        }
      };
      
      initializeVideo();
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, videoRef, setIsFirstLoad, currentVideo]);
  
  // Add listeners for first user interaction
  useEffect(() => {
    if (hasUserInteraction) return;
    
    const handleInteraction = () => {
      handleUserInteraction();
      
      // Try to play video after interaction
      if (videoRef.current) {
        videoRef.current.play().catch(err => 
          console.warn("Error playing after interaction:", err)
        );
      }
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
  }, [handleUserInteraction, hasUserInteraction, videoRef]);
};
