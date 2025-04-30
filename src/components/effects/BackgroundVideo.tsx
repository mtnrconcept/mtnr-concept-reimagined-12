
import React, { useEffect, useRef, useState } from 'react';
import { useUVMode } from './UVModeContext';
import { useLocation } from 'react-router-dom';

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  fallbackImage?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ 
  videoUrl = "/lovable-uploads/Composition 1.mp4", 
  videoUrlUV = "/lovable-uploads/Composition 1_1.mp4",
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { uvMode } = useUVMode();
  const location = useLocation();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimerRef = useRef<number | null>(null);
  
  // Composition 1.mp4 pour le mode UV actif
  const currentVideoUrl = uvMode ? videoUrl : videoUrlUV;
  
  // Gestion du changement de vidéo lorsque le mode UV change
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Recharger la vidéo quand le mode UV change
    videoElement.load();
    videoElement.pause();
    videoElement.currentTime = 0;
    
    console.log(`Mode UV ${uvMode ? 'activé' : 'désactivé'}, vidéo changée pour ${currentVideoUrl}`);
  }, [uvMode, currentVideoUrl]);

  // Force pause après la lecture de la vidéo complète
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleEnded = () => {
      console.log('Vidéo terminée, mise en pause');
      videoElement.pause();
      videoElement.currentTime = 0;
      setIsTransitioning(false);
    };
    
    videoElement.addEventListener('ended', handleEnded);
    return () => {
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  // Gestion de la lecture/pause de la vidéo lors des transitions de page
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Nettoyer le timer précédent si existant
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    
    if (isFirstLoad) {
      // À la première charge, mettre la vidéo en pause
      videoElement.pause();
      videoElement.currentTime = 0;
      setIsFirstLoad(false);
      console.log('Vidéo initialisée en pause');
    } else {
      // Lors des changements de route, jouer la vidéo pendant quelques secondes
      const playVideo = async () => {
        try {
          setIsTransitioning(true);
          videoElement.currentTime = 0; // Assurer que la vidéo commence du début
          videoElement.playbackRate = 1.0;
          await videoElement.play();
          console.log('Vidéo lancée au changement de route');
          
          // Arrêter la vidéo après la durée de transition (8s)
          transitionTimerRef.current = window.setTimeout(() => {
            if (videoElement) {
              console.log('Timer expiré, mise en pause de la vidéo');
              videoElement.pause();
              setIsTransitioning(false);
            }
          }, 8000);
        } catch (error) {
          console.error('Erreur lors de la lecture de la vidéo:', error);
          setIsTransitioning(false);
        }
      };
      
      playVideo();
    }
    
    // Gestion de la visibilité de la page
    const handleVisibilityChange = () => {
      if (document.hidden && videoElement) {
        videoElement.pause();
        console.log('Page non visible, vidéo en pause');
      } else if (videoElement && !isFirstLoad && isTransitioning) {
        videoElement.play().catch(err => {
          console.error('Erreur lors de la reprise de lecture:', err);
        });
        console.log('Page à nouveau visible pendant transition, reprise de la lecture');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
      if (videoElement) videoElement.pause();
    };
  }, [location.pathname, isFirstLoad, isTransitioning]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
      {/* Vidéo en fond */}
      <video
        ref={videoRef}
        className="absolute inset-0 min-w-full min-h-full object-cover"
        poster={fallbackImage}
        playsInline
        muted
        preload="auto"
      >
        <source src={currentVideoUrl} type="video/mp4" />
      </video>
      
      {/* Grille */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.15) 1px, transparent 1px)',
          backgroundSize: '35px 35px', 
          transform: 'translateZ(-50px)',
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default BackgroundVideo;
