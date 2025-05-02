
import { RefObject } from 'react';

export interface VideoState {
  videoError: boolean;
  isPlaying: boolean;
  isTransitioning: boolean;
  isFirstLoad: boolean;
  hasUserInteraction: boolean;
  retryCount: number;
  loadAttempts?: number;
}

export interface VideoActions {
  setVideoError: (error: boolean) => void;
  setIsFirstLoad: (isFirst: boolean) => void;
  setHasUserInteraction: (hasInteraction: boolean) => void;
  playVideoTransition: () => Promise<void>;
  handleUserInteraction: () => void;
  retryVideo: () => void;
}

export interface UseBackgroundVideoProps {
  videoUrl: string;
  videoUrlUV: string;
  fallbackImage?: string;
}

export interface UseBackgroundVideoReturn extends VideoState, VideoActions {
  videoRef: RefObject<HTMLVideoElement>;
  currentVideo: string; 
  fallbackImage: string;
  uvMode: boolean;
}
