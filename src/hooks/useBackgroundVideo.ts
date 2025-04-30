import { useState, useEffect, useRef, useCallback } from 'react';
import { useUVMode } from '@/components/effects/UVModeContext';
import { useTorch }  from '@/components/effects/TorchContext';

interface UseBackgroundVideoProps {
  videoUrl:   string;
  videoUrlUV: string;
}

export const useBackgroundVideo = ({
  videoUrl,
  videoUrlUV
}: UseBackgroundVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { uvMode }       = useUVMode();
  const { isTorchActive } = useTorch();

  const [currentVideo, setCurrentVideo] = useState(videoUrl);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 1) Swap source une seule fois à chaque changement de uvMode
  useEffect(() => {
    const src = uvMode ? videoUrlUV : videoUrl;
    if (videoRef.current && src !== currentVideo) {
      videoRef.current.src = src;
      setCurrentVideo(src);
      // pas de load() pour éviter le blackout
    }
  }, [uvMode, videoUrl, videoUrlUV, currentVideo]);

  // 2) Lance la vidéo 7s et la remet à 0
  const playVideoTransition = useCallback(() => {
    const v = videoRef.current;
    if (!v || isTransitioning) return;
    setIsTransitioning(true);

    v.currentTime  = 0;
    v.playbackRate = 1;
    v.play().catch(()=>{}); // mute autoplay fallback géré ailleurs

    // Stoppe après 7s
    setTimeout(() => {
      v.pause();
      v.currentTime = 0;
      setIsTransitioning(false);
    }, 7000);
  }, [isTransitioning]);

  // 3) Si la torche s'active, on lance auto
  useEffect(() => {
    if (isTorchActive) playVideoTransition();
  }, [isTorchActive, playVideoTransition]);

  return { videoRef, currentVideo, isTransitioning, playVideoTransition };
};
