
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
  
  // États locaux avec valeurs initiales correctes
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasUserInteraction, setHasUserInteraction] = useState(false);
  
  // Définir le bon chemin de vidéo basé sur le mode UV
  // Si uvMode actif = Composition 1.mp4
  // Si uvMode inactif = Composition 1_1.mp4
  const currentVideo = useMemo(() => {
    return uvMode ? videoUrl : videoUrlUV;
  }, [uvMode, videoUrl, videoUrlUV]);

  // Fonction pour gérer la première interaction utilisateur
  const handleUserInteraction = useCallback(() => {
    if (!hasUserInteraction) {
      setHasUserInteraction(true);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    }
  }, [hasUserInteraction]);

  // Version optimisée de playVideoTransition avec useCallback
  const playVideoTransition = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || isTransitioning) return;
    
    try {
      console.log('Tentative de transition vidéo - Mode UV:', uvMode);
      setIsTransitioning(true);
      
      // S'assurer que la vidéo est chargée avec la bonne source avant de jouer
      if (videoElement.src !== currentVideo) {
        console.log('Changement de source vidéo vers:', currentVideo);
        videoElement.src = currentVideo;
        
        // Attendre que les métadonnées soient chargées avant de continuer
        if (videoElement.readyState < 2) {
          await new Promise((resolve) => {
            const handleMetadata = () => {
              videoElement.removeEventListener('loadedmetadata', handleMetadata);
              resolve(null);
            };
            videoElement.addEventListener('loadedmetadata', handleMetadata);
          });
        }
      }
      
      videoElement.currentTime = 0;
      videoElement.playbackRate = 1.0;
      
      // Ajouter l'écouteur d'événement 'ended' avant de lancer la lecture
      const handleVideoEnded = () => {
        console.log('Vidéo terminée, mise en pause');
        if (videoElement) {
          videoElement.pause();
          videoElement.currentTime = 0;
        }
        setIsTransitioning(false);
        videoElement.removeEventListener('ended', handleVideoEnded);
      };
      
      videoElement.removeEventListener('ended', handleVideoEnded);
      videoElement.addEventListener('ended', handleVideoEnded);
      
      console.log('Lecture de la vidéo...');
      await videoElement.play();
    } catch (error) {
      console.error('Erreur lors de la lecture de la vidéo:', error);
      setIsTransitioning(false);
    }
  }, [isTransitioning, currentVideo, uvMode]);

  // Effet pour les changements de mode UV uniquement
  useEffect(() => {
    if (!isFirstLoad && isTorchActive && hasUserInteraction) {
      console.log("Mode UV changé à:", uvMode, "- Lancement de la transition...");
      // Utiliser setTimeout pour éviter les problèmes de timing
      const timer = setTimeout(() => playVideoTransition(), 100);
      return () => clearTimeout(timer);
    }
  }, [uvMode, isFirstLoad, playVideoTransition, isTorchActive, hasUserInteraction]);

  // Écouter les événements de navigation
  useEffect(() => {
    const handleVideoTransition = () => {
      if (hasUserInteraction) {
        playVideoTransition();
      }
    };
    
    const unregister = navigation.registerVideoTransitionListener(handleVideoTransition);
    return unregister;
  }, [navigation, playVideoTransition, hasUserInteraction]);
  
  // Écouter l'activation de la torche
  useEffect(() => {
    if (!isFirstLoad && isTorchActive !== undefined && hasUserInteraction) {
      // Si la torche vient d'être activée, s'assurer que la bonne vidéo est sélectionnée
      const videoElement = videoRef.current;
      if (videoElement && videoElement.src !== currentVideo) {
        console.log("Torche changée, mise à jour de la source vidéo:", currentVideo);
        videoElement.src = currentVideo;
        videoElement.load();
      }
    }
  }, [isTorchActive, isFirstLoad, currentVideo, hasUserInteraction]);
  
  // Initialisation et gestion de la visibilité
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // S'assurer que la vidéo a la bonne source dès le début
    if (videoElement.src !== currentVideo) {
      videoElement.src = currentVideo;
    }
    
    if (isFirstLoad) {
      videoElement.load();
      videoElement.pause();
      videoElement.currentTime = 0;
      setIsFirstLoad(false);
      console.log('Vidéo initialisée avec source:', currentVideo);
    }
    
    // Ajout des écouteurs pour la première interaction utilisateur
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    // Gestion de la visibilité de la page
    const handleVisibilityChange = () => {
      if (!videoElement) return;
      
      if (document.hidden) {
        videoElement.pause();
      } else if (!isFirstLoad && isTransitioning && hasUserInteraction) {
        videoElement.play().catch(err => {
          console.error('Erreur lors de la reprise de lecture:', err);
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      
      if (videoElement) {
        videoElement.pause();
      }
    };
  }, [isFirstLoad, isTransitioning, currentVideo, handleUserInteraction, hasUserInteraction]);

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
