
import { useState, useCallback } from 'react';

/**
 * Hook to manage preload status state
 */
export const usePreloadStatus = () => {
  const [preloadStatus, setPreloadStatus] = useState<Record<string, boolean>>({});
  const [isPreloading, setIsPreloading] = useState(true);
  
  const updatePreloadStatus = useCallback((results: Record<string, boolean>) => {
    setPreloadStatus(results);
  }, []);

  return {
    preloadStatus,
    updatePreloadStatus,
    isPreloading,
    setIsPreloading
  };
};
