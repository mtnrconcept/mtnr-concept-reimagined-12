
import React, { useEffect, useState, useRef } from 'react';
import useBackgroundVideo from '../../hooks/useBackgroundVideo';
import { useUVMode } from './UVModeContext';
import { useLocation } from 'react-router-dom';
import { useNavigation } from './NavigationContext';

interface BackgroundVideoProps {
  videoUrl?: string;
  videoUrlUV?: string;
  fallbackImage?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ 
  videoUrl = "/lovable-uploads/videonormale.mp4", 
  videoUrlUV = "/lovable-uploads/videouv.mp4", 
  fallbackImage = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png"
}) => {
  // Références pour les éléments vidéo
  const normalVideoRef = useRef<HTMLVideoElement>(null);
  const uvVideoRef = useRef<HTMLVideoElement>(null);
  
  const [loadingStatus, setLoadingStatus] = useState('loading');
  const [videoError, setVideoError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const navigation = useNavigation();
  
  // Référence pour stocker le chemin précédent
  const previousPathRef = useRef(location.pathname);
  
  // Utilisation du contexte UV pour déterminer quelle vidéo afficher
  const { uvMode } = useUVMode();

  // Effet pour initialiser les vidéos au chargement
  useEffect(() => {
    const normalVideo = normalVideoRef.current;
    const uvVideo = uvVideoRef.current;
    
    if (!normalVideo || !uvVideo) return;
    
    // Configuration initiale des vidéos
    const setupVideo = async () => {
      try {
        // Chargement initial des deux vidéos mais sans lecture
        normalVideo.load();
        uvVideo.load();
        
        // Les vidéos restent en pause initialement
        normalVideo.pause();
        uvVideo.pause();
        
        setLoadingStatus('ready');
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des vidéos:', error);
        setVideoError(true);
        setLoadingStatus('error');
      }
    };
    
    setupVideo();
  }, []);

  // Gestion des changements de page pour démarrer la lecture
  useEffect(() => {
    const normalVideo = normalVideoRef.current;
    const uvVideo = uvVideoRef.current;
    
    if (!normalVideo || !uvVideo) return;
    
    // Vérifier si la page a réellement changé
    if (location.pathname !== previousPathRef.current) {
      console.log(`Navigation détectée: ${previousPathRef.current} -> ${location.pathname}`);
      previousPathRef.current = location.pathname;
      
      setIsTransitioning(true);
      
      // Lire la vidéo appropriée selon le mode UV
      if (uvMode) {
        uvVideo.currentTime = 0;
        uvVideo.play()
          .then(() => console.log('Lecture de la vidéo UV démarrée'))
          .catch(err => console.error('Erreur de lecture vidéo UV:', err));
      } else {
        normalVideo.currentTime = 0;
        normalVideo.play()
          .then(() => console.log('Lecture de la vidéo normale démarrée'))
          .catch(err => console.error('Erreur de lecture vidéo normale:', err));
      }
    }
  }, [location.pathname, uvMode]);

  // Écouter les événements de navigation (via NavigationContext)
  useEffect(() => {
    const handleTransition = () => {
      const normalVideo = normalVideoRef.current;
      const uvVideo = uvVideoRef.current;
      
      if (!normalVideo || !uvVideo) return;
      
      setIsTransitioning(true);
      
      // Lire la vidéo appropriée selon le mode UV
      if (uvMode) {
        uvVideo.currentTime = 0;
        uvVideo.play()
          .then(() => console.log('Lecture de la vidéo UV démarrée (via navigationContext)'))
          .catch(err => console.error('Erreur de lecture vidéo UV:', err));
      } else {
        normalVideo.currentTime = 0;
        normalVideo.play()
          .then(() => console.log('Lecture de la vidéo normale démarrée (via navigationContext)'))
          .catch(err => console.error('Erreur de lecture vidéo normale:', err));
      }
    };
    
    // S'abonner au contexte de navigation pour les transitions
    const unregister = navigation.registerVideoTransitionListener(handleTransition);
    return unregister;
  }, [navigation, uvMode]);

  // Gestion des événements vidéo
  useEffect(() => {
    const handleEvents = (video: HTMLVideoElement | null, name: string) => {
      if (!video) return;
      
      const handleCanPlay = () => {
        console.log(`Vidéo ${name} prête à être lue:`, video.src);
      };
      
      const handlePlaying = () => {
        console.log(`Lecture vidéo ${name} démarrée:`, video.src);
      };
      
      const handlePause = () => {
        console.log(`Lecture vidéo ${name} mise en pause:`, video.src);
      };
      
      const handleEnded = () => {
        console.log(`Vidéo ${name} terminée, mise en pause automatique`);
        setIsTransitioning(false);
        // Mettre en pause la vidéo lorsqu'elle est terminée
        video.pause();
      };
      
      const handleError = (e: Event) => {
        console.error(`Erreur vidéo ${name} détectée:`, e);
        setVideoError(true);
        setLoadingStatus('error');
      };
      
      const handleWaiting = () => {
        console.log(`Vidéo ${name} en attente de données:`, video.src);
        setLoadingStatus('waiting');
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('error', handleError);
      video.addEventListener('waiting', handleWaiting);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('error', handleError);
        video.removeEventListener('waiting', handleWaiting);
      };
    };
    
    const cleanupNormal = handleEvents(normalVideoRef.current, 'normale');
    const cleanupUV = handleEvents(uvVideoRef.current, 'UV');
    
    return () => {
      cleanupNormal?.();
      cleanupUV?.();
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0 bg-black">
      {/* Indicateurs de statut */}
      {loadingStatus === 'loading' && !videoError && (
        <div className="absolute top-0 left-0 bg-yellow-500 text-xs text-black px-2 py-0.5 opacity-70 z-50">
          Chargement vidéo...
        </div>
      )}
      {loadingStatus === 'waiting' && !videoError && (
        <div className="absolute top-0 left-0 bg-yellow-500 text-xs text-black px-2 py-0.5 opacity-70 z-50">
          Mise en mémoire tampon...
        </div>
      )}
      {videoError && (
        <div className="absolute top-0 left-0 bg-red-500 text-xs text-white px-2 py-0.5 opacity-70 z-50">
          Erreur vidéo - Mode fallback
        </div>
      )}
      {isTransitioning && (
        <div className="absolute top-0 left-0 bg-blue-500 text-xs text-white px-2 py-0.5 opacity-70 z-50">
          Transition de page
        </div>
      )}
      
      {/* Vidéo normale - visible quand UV est désactivé */}
      <video
        ref={normalVideoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${uvMode ? 'opacity-0' : 'opacity-100'}`}
        poster={fallbackImage}
        playsInline
        muted
        preload="auto"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      
      {/* Vidéo UV - visible quand UV est activé */}
      <video
        ref={uvVideoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${uvMode ? 'opacity-100' : 'opacity-0'}`}
        poster={fallbackImage}
        playsInline
        muted
        preload="auto"
      >
        <source src={videoUrlUV} type="video/mp4" />
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
