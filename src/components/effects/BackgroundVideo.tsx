
import React, { useEffect, useRef, useState } from 'react';
import { useUVMode } from './UVModeContext';
import { useLocation } from 'react-router-dom';
import { useNavigation } from './NavigationContext';
import { useTorch } from './TorchContext';

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
  const { isTorchActive } = useTorch();
  const location = useLocation();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(videoUrl);
  const navigation = useNavigation();
  
  // Gestion du changement de vidéo lorsque le mode UV change
  useEffect(() => {
    const newVideoUrl = uvMode ? videoUrlUV : videoUrl;
    
    if (currentVideo !== newVideoUrl) {
      console.log(`Mode UV ${uvMode ? 'activé' : 'désactivé'}, vidéo changée pour ${newVideoUrl}`);
      setCurrentVideo(newVideoUrl);
      
      // Jouer la transition vidéo immédiatement quand le mode UV change
      if (isTorchActive) {
        setTimeout(() => playVideoTransition(), 50); // Petit délai pour s'assurer que currentVideo est mis à jour
      }
    }
  }, [uvMode, videoUrl, videoUrlUV]);

  // Jouer la vidéo quand la torche est activée/désactivée
  useEffect(() => {
    if (!isFirstLoad) {
      // Ne pas changer de vidéo ici, juste jouer la transition
      playVideoTransition();
    }
  }, [isTorchActive]);

  // Fonction pour jouer la vidéo en transition
  const playVideoTransition = async () => {
    const videoElement = videoRef.current;
    if (!videoElement || isTransitioning) return;
    
    try {
      console.log('Transition vidéo déclenchée (torche ou navigation)');
      setIsTransitioning(true);
      videoElement.load(); // Recharge la vidéo avec la source actuelle
      videoElement.currentTime = 0;
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
    } catch (error) {
      console.error('Erreur lors de la lecture de la vidéo:', error);
      setIsTransitioning(false);
      if (videoElement) {
        videoElement.removeEventListener('ended', () => {});
      }
    }
  };

  // Écouter les événements de navigation pour jouer la vidéo instantanément
  useEffect(() => {
    const unregister = navigation.registerVideoTransitionListener(() => {
      // On ne change pas la vidéo lors de la navigation, on joue juste la transition
      playVideoTransition();
    });
    return unregister;
  }, [navigation]);
  
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
      playVideoTransition();
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
  }, [location.pathname, isFirstLoad]);

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
        <source src={currentVideo} type="video/mp4" />
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
