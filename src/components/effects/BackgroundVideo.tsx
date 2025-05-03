
import React, { useEffect, useState, useRef } from 'react';
import useBackgroundVideo from '../../hooks/useBackgroundVideo';
import { useUVMode } from './UVModeContext';

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
        // Lecture initiale silencieuse des deux vidéos
        await normalVideo.play();
        await uvVideo.play();
        
        // Mettre en pause après le début pour que la vidéo soit prête
        normalVideo.pause();
        uvVideo.pause();
        
        // Lire la vidéo normale au début
        if (!uvMode) {
          normalVideo.play();
        } else {
          uvVideo.play();
        }
        
        setLoadingStatus('ready');
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des vidéos:', error);
        setVideoError(true);
        setLoadingStatus('error');
      }
    };
    
    setupVideo();
  }, []);

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
      video.addEventListener('error', handleError);
      video.addEventListener('waiting', handleWaiting);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('pause', handlePause);
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
      
      {/* Vidéo normale - visible quand UV est désactivé */}
      <video
        ref={normalVideoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${uvMode ? 'opacity-0' : 'opacity-100'}`}
        poster={fallbackImage}
        playsInline
        muted
        preload="auto"
        loop
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
        loop
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
