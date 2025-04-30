
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
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
  const navigation = useNavigation();
  
  // États locaux optimisés avec valeurs initiales correctes
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Définir le bon chemin de vidéo basé sur le mode UV
  // Si uvMode actif = Composition 1.mp4
  // Si uvMode inactif = Composition 1_1.mp4
  const currentVideo = useMemo(() => {
    return uvMode ? videoUrl : videoUrlUV;
  }, [uvMode, videoUrl, videoUrlUV]);

  // Version optimisée de playVideoTransition avec useCallback
  const playVideoTransition = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || isTransitioning) return;
    
    try {
      console.log('Transition vidéo déclenchée');
      setIsTransitioning(true);
      
      // S'assurer que la vidéo est chargée avec la bonne source avant de jouer
      if (videoElement.src !== currentVideo) {
        videoElement.src = currentVideo;
      }
      
      videoElement.load();
      videoElement.currentTime = 0;
      videoElement.playbackRate = 1.0;
      
      // Ajouter l'écouteur d'événement 'ended' avant de lancer la lecture
      const handleVideoEnded = () => {
        console.log('Vidéo terminée, mise en pause');
        videoElement.pause();
        videoElement.currentTime = 0;
        setIsTransitioning(false);
        videoElement.removeEventListener('ended', handleVideoEnded);
      };
      
      videoElement.removeEventListener('ended', handleVideoEnded);
      videoElement.addEventListener('ended', handleVideoEnded);
      
      await videoElement.play();
    } catch (error) {
      console.error('Erreur lors de la lecture de la vidéo:', error);
      setIsTransitioning(false);
      if (videoElement) {
        videoElement.removeEventListener('ended', () => {});
      }
    }
  }, [isTransitioning, currentVideo]);

  // Effet pour les changements de mode UV
  // Déclencher la transition uniquement quand le mode UV change
  useEffect(() => {
    if (!isFirstLoad) {
      // Petit délai pour s'assurer que le DOM est prêt
      const timer = setTimeout(() => playVideoTransition(), 50);
      return () => clearTimeout(timer);
    }
  }, [uvMode, playVideoTransition, isFirstLoad]);

  // Ne pas déclencher de transition si seulement la torche est activée/désactivée
  // sans changement de mode UV
  useEffect(() => {
    // Ne rien faire si seulement l'état de la torche change
    // La vidéo reste la même selon le mode UV actuel
  }, [isTorchActive]);

  // Effet pour écouter les événements de navigation
  useEffect(() => {
    const unregister = navigation.registerVideoTransitionListener(playVideoTransition);
    return unregister;
  }, [navigation, playVideoTransition]);
  
  // Effet d'initialisation et de gestion des transitions de page
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // S'assurer que la vidéo a la bonne source dès le début
    if (videoElement.src !== currentVideo) {
      videoElement.src = currentVideo;
      videoElement.load();
    }
    
    if (isFirstLoad) {
      videoElement.pause();
      videoElement.currentTime = 0;
      setIsFirstLoad(false);
      console.log('Vidéo initialisée en pause avec source:', currentVideo);
    }
    
    // Gestion de la visibilité de la page
    const handleVisibilityChange = () => {
      if (!videoElement) return;
      
      if (document.hidden) {
        videoElement.pause();
      } else if (!isFirstLoad && isTransitioning) {
        videoElement.play().catch(err => {
          console.error('Erreur lors de la reprise de lecture:', err);
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (videoElement) {
        videoElement.pause();
        videoElement.removeEventListener('ended', () => {});
      }
    };
  }, [location.pathname, isFirstLoad, isTransitioning, currentVideo]);

  // Préchargement des vidéos
  useEffect(() => {
    const preloadVideos = async () => {
      const videoUrls = [videoUrl, videoUrlUV];
      for (const url of videoUrls) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = 'video';
        document.head.appendChild(link);
      }
    };
    
    preloadVideos();
  }, [videoUrl, videoUrlUV]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
      {/* Une seule vidéo avec source dynamique au lieu de deux éléments vidéo */}
      <video
        ref={videoRef}
        className="absolute inset-0 min-w-full min-h-full object-cover"
        poster={fallbackImage}
        playsInline
        muted
        preload="auto"
        src={currentVideo}
      >
        {/* Plus besoin de source spécifique ici car on définit src directement sur l'élément vidéo */}
      </video>
      
      {/* Grille avec performance optimisée */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.15) 1px, transparent 1px)',
          backgroundSize: '35px 35px', 
          transform: 'translateZ(-50px)',
          mixBlendMode: 'overlay',
          willChange: 'transform'
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
