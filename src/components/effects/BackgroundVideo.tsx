
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
  
  // Détermine quelle vidéo utiliser en fonction du mode UV
  const currentVideoUrl = uvMode ? videoUrlUV : videoUrl;
  
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
  
  // Gestion de la lecture/pause de la vidéo
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
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
          videoElement.playbackRate = 1.0; // Vitesse réelle
          await videoElement.play();
          console.log('Vidéo lancée au changement de route');
          
          // Arrêter la vidéo après la durée de transition (3s fade out + 2s pause + 3s fade in = 8s)
          const transitionTimer = setTimeout(() => {
            if (videoElement) {
              videoElement.pause();
              setIsTransitioning(false);
              console.log('Vidéo mise en pause après la transition');
            }
          }, 8000);
          
          return () => clearTimeout(transitionTimer);
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
      } else if (videoElement && !isFirstLoad && isTransitioning) {
        // Ne relancer la lecture que si on est en transition
        videoElement.play();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
        // Suppression de l'attribut "loop" pour empêcher la lecture en boucle
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
