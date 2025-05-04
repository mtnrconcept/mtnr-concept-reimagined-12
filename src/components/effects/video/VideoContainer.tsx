
import React, { useEffect, useRef, memo } from 'react';
import { useOptimizedVideo } from '@/hooks/useOptimizedVideo';
import VideoElement from './VideoElement';
import VideoStatusIndicators from './VideoStatusIndicators';
import VideoOverlayEffects from './VideoOverlayEffects';

interface VideoContainerProps {
  videoUrl?: string;
  videoUrlUV?: string;
}

const VideoContainer: React.FC<VideoContainerProps> = memo(({ 
  videoUrl = "/lovable-uploads/videonormale.mp4", 
  videoUrlUV = "/lovable-uploads/videouv.mp4"
}) => {
  // Use our optimized hook instead of useVideoStatus
  const {
    videoRef,
    loadingStatus,
    videoError,
    isTransitioning,
    uvMode
  } = useOptimizedVideo(videoUrl, videoUrlUV);
  
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  // Optimisation du parallaxe avec un RequestAnimationFrame optimisé
  useEffect(() => {
    let ticking = false;
    let lastKnownScrollPosition = 0;
    let lastKnownMouseX = 0;
    let lastKnownMouseY = 0;
    let rafId: number;
    
    const updateVideoPosition = () => {
      if (!videoRef.current) return;
      
      const scrollY = lastKnownScrollPosition;
      const translateY = scrollY * -0.15;
      
      const mouseX = lastKnownMouseX * 3;
      const mouseY = lastKnownMouseY * 3;
      
      // Utiliser transform3d pour une meilleure performance
      videoRef.current.style.transform = `translate3d(${mouseX}px, ${translateY}px, 0) scale(1.1)`;
      
      ticking = false;
    };
    
    const handleScroll = () => {
      lastKnownScrollPosition = window.scrollY;
      
      if (!ticking) {
        rafId = requestAnimationFrame(updateVideoPosition);
        ticking = true;
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Limiter les mises à jour inutiles
      const newX = (e.clientX / window.innerWidth - 0.5) * 2;
      const newY = (e.clientY / window.innerHeight - 0.5) * 2;
      
      // Seuil minimal de mouvement pour éviter des mises à jour trop fréquentes
      const threshold = 0.01;
      if (Math.abs(newX - lastKnownMouseX) > threshold || Math.abs(newY - lastKnownMouseY) > threshold) {
        lastKnownMouseX = newX;
        lastKnownMouseY = newY;
        
        if (!ticking) {
          rafId = requestAnimationFrame(updateVideoPosition);
          ticking = true;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    updateVideoPosition();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={videoContainerRef} className="fixed inset-0 w-full h-full overflow-hidden z-[-10] bg-black">
      {/* Status indicators for debug/development */}
      <VideoStatusIndicators 
        loadingStatus={loadingStatus} 
        videoError={videoError} 
        isTransitioning={isTransitioning} 
      />
      
      {/* The actual video element */}
      <VideoElement 
        videoRef={videoRef}
        videoUrl={videoUrl}
        videoUrlUV={videoUrlUV}
        uvMode={uvMode}
      />
      
      {/* Overlay effects (grid and vignette) */}
      <VideoOverlayEffects />
    </div>
  );
});

VideoContainer.displayName = 'VideoContainer';

export default VideoContainer;
