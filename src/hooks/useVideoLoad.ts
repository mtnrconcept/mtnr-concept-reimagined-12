
import { useBasicVideoEvents } from './useBasicVideoEvents';
import { useVideoPlayabilityCheck } from './useVideoPlayabilityCheck';

interface UseVideoLoadOptions {
  onVideoError?: (src: string, error: Event | null) => void;
  onVideoLoaded?: (src: string) => void;
}

/**
 * Combined hook for video loading, error handling, and playability checking
 */
export const useVideoLoad = (options: UseVideoLoadOptions = {}) => {
  const basicEvents = useBasicVideoEvents(options);
  const playabilityCheck = useVideoPlayabilityCheck();
  
  return {
    ...basicEvents,
    ...playabilityCheck
  };
};
