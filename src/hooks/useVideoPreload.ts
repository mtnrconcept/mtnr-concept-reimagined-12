
import { useEffect } from 'react';

interface UseVideoPreloadProps {
  videoUrls: string[];
}

export const useVideoPreload = ({ videoUrls }: UseVideoPreloadProps) => {
  useEffect(() => {
    const preloadVideos = async () => {
      for (const url of videoUrls) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = 'video';
        document.head.appendChild(link);
      }
    };
    
    preloadVideos();
  }, [videoUrls]);
};
