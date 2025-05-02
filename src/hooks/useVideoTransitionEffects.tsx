
import { useEffect, useCallback } from 'react';
import { useNavigation } from '@/components/effects/NavigationContext';

interface UseVideoTransitionEffectsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onTransition: () => void;
}

export const useVideoTransitionEffects = ({
  videoRef,
  onTransition
}: UseVideoTransitionEffectsProps) => {
  const navigation = useNavigation();

  // Handle navigation transition events
  useEffect(() => {
    const unregister = navigation.registerVideoTransitionListener(() => {
      console.log("Video transition triggered by navigation");
      if (onTransition) {
        onTransition();
      }
    });
    
    return () => {
      unregister();
    };
  }, [navigation, onTransition]);

  // Handle video state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Configure video
    video.playsInline = true;
    video.muted = true;
    
    // Attempt autoplay
    const attemptPlay = () => {
      video.play().catch(error => {
        console.warn("Autoplay prevented:", error);
      });
    };
    
    attemptPlay();
    
    // Enable play on user interaction
    const handleUserInteraction = () => {
      attemptPlay();
    };
    
    // Add event listeners for user interaction
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [videoRef]);
};
