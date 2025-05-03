
import React, { useEffect, useState, useRef } from 'react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [loadingStatus, setLoadingStatus] = useState('loading');
  const [videoError, setVideoError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const navigation = useNavigation();
  
  // Référence pour stocker le chemin précédent
  const previousPathRef = useRef(location.pathname);
  
  // Utilisation du contexte UV pour déterminer quelle vidéo afficher
  const { uvMode } = useUVMode();

  // Effet pour initialiser la vidéo au chargement
  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;
    
    // Configuration initiale de la vidéo
    const setupVideo = async () => {
      try {
        // Définir la source vidéo en fonction du mode UV
        video.src = uvMode ? videoUrlUV : videoUrl;
        
        // Chargement initial de la vidéo mais sans lecture
        video.load();
        video.pause();
        
        setLoadingStatus('ready');
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la vidéo:', error);
        setVideoError(true);
        setLoadingStatus('error');
      }
    };
    
    setupVideo();
  }, []);

  // Mise à jour de la source vidéo lors du changement de mode UV
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Changer la source vidéo immédiatement quand le mode UV change
    video.src = uvMode ? videoUrlUV : videoUrl;
    video.load();
    // S'assurer que la vidéo reste en pause
    setTimeout(() => {
      video.pause();
    }, 0);
    
    console.log(`Mode UV ${uvMode ? 'activé' : 'désactivé'}, vidéo changée immédiatement et mise en pause`);
  }, [uvMode, videoUrl, videoUrlUV]);

  // Gestion des changements de page pour démarrer la lecture
  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;
    
    // Vérifier si la page a réellement changé
    if (location.pathname !== previousPathRef.current) {
      console.log(`Navigation détectée: ${previousPathRef.current} -> ${location.pathname}`);
      previousPathRef.current = location.pathname;
      
      setIsTransitioning(true);
      
      // Remettre la vidéo au début et lancer la lecture
      video.currentTime = 0;
      video.play()
        .then(() => console.log('Lecture de la vidéo démarrée pour transition de page'))
        .catch(err => console.error('Erreur de lecture vidéo:', err));
    }
  }, [location.pathname]);

  // Écouter les événements de navigation (via NavigationContext)
  useEffect(() => {
    const handleTransition = () => {
      const video = videoRef.current;
      
      if (!video) return;
      
      setIsTransitioning(true);
      
      // Remettre la vidéo au début et lancer la lecture
      video.currentTime = 0;
      video.play()
        .then(() => console.log('Lecture de la vidéo démarrée (via navigationContext)'))
        .catch(err => console.error('Erreur de lecture vidéo:', err));
    };
    
    // S'abonner au contexte de navigation pour les transitions
    const unregister = navigation.registerVideoTransitionListener(handleTransition);
    return unregister;
  }, [navigation]);

  // Gestion des événements vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleCanPlay = () => {
      console.log('Vidéo prête à être lue:', video.src);
    };
    
    const handlePlaying = () => {
      console.log('Lecture vidéo démarrée:', video.src);
    };
    
    const handlePause = () => {
      console.log('Lecture vidéo mise en pause:', video.src);
    };
    
    const handleEnded = () => {
      console.log('Vidéo terminée, mise en pause automatique');
      setIsTransitioning(false);
      // Mettre en pause la vidéo lorsqu'elle est terminée
      video.pause();
    };
    
    const handleError = (e: Event) => {
      console.error('Erreur vidéo détectée:', e);
      setVideoError(true);
      setLoadingStatus('error');
    };
    
    const handleWaiting = () => {
      console.log('Vidéo en attente de données:', video.src);
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
      
      {/* Une seule vidéo avec source dynamique */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        poster={fallbackImage}
        playsInline
        muted
        preload="auto"
      >
        <source src={uvMode ? videoUrlUV : videoUrl} type="video/mp4" />
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
