
import { RefObject } from "react";

export interface VideoState {
  isFirstLoad: boolean;
  isTransitioning: boolean;
  currentVideo: string;
  videoError: boolean;
  retryCount: number;
}

export interface VideoActions {
  setIsFirstLoad: (value: boolean) => void;
  setIsTransitioning: (value: boolean) => void;
  setCurrentVideo: (url: string) => void;
  setVideoError: (value: boolean) => void;
  setRetryCount: (value: number) => void;
  playVideoTransition: () => Promise<void>;
  handleVideoDurationChange: () => void;
}

export interface UseBackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  fallbackImage?: string;
  autoPlay?: boolean;
}

export interface UseBackgroundVideoReturn extends VideoState, VideoActions {
  videoRef: RefObject<HTMLVideoElement>;
  fallbackImage: string;
  uvMode: boolean;
  isTorchActive: boolean;
}
