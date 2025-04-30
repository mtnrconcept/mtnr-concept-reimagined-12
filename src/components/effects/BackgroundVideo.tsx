
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

  // Gestion de la lecture/pause de la vidéo lors des transitions de page
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
      // Lors des changements de route, jouer la vidéo une seule fois
      const playVideo = async () => {
        try {
          setIsTransitioning(true);
          videoElement.currentTime = 0; // Assurer que la vidéo commence du début
          videoElement.playbackRate = 1.0;
          
          // Ajouter l'écouteur d'événement 'ended' avant de lancer la lecture
          const handleVideoEnded = () => {
            console.log('Vidéo terminée, mise en pause');
            videoElement.pause();
            videoElement.currentTime = 0;
            setIsTransitioning(false);
            // Retirer l'écouteur pour éviter des déclenchements multiples
            videoElement.removeEventListener('ended', handleVideoEnded);
          };
          
          // S'assurer qu'on n'a pas d'écouteurs en double
          videoElement.removeEventListener('ended', handleVideoEnded);
          // Ajouter l'écouteur d'événement
          videoElement.addEventListener('ended', handleVideoEnded);
          
          await videoElement.play();
          console.log('Vidéo lancée au changement de route');
        } catch (error) {
          console.error('Erreur lors de la lecture de la vidéo:', error);
          setIsTransitioning(false);
          videoElement.removeEventListener('ended', () => {});
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
      if (videoElement) {
        videoElement.pause();
        // Retirer tous les écouteurs d'événements
        videoElement.removeEventListener('ended', () => {});
      }
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
