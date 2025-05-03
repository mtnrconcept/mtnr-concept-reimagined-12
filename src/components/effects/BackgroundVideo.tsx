
import React, { useEffect, useState } from 'react';
import useBackgroundVideo from '../../hooks/useBackgroundVideo';

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
  const {
    videoRef,
    currentVideo,
    isTransitioning,
    fallbackImage: fallbackImg,
    videoError
  } = useBackgroundVideo({
    videoUrl,
    videoUrlUV,
    fallbackImage
  });
  
  // État local pour gérer le statut de chargement
  const [loadingStatus, setLoadingStatus] = useState('loading');

  // Gérer les événements vidéo pour déboguer et mettre à jour l'interface
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleCanPlay = () => {
      console.log('Vidéo prête à être lue:', currentVideo);
      setLoadingStatus('ready');
    };
    
    const handlePlaying = () => {
      console.log('Lecture vidéo démarrée:', currentVideo);
      setLoadingStatus('playing');
    };
    
    const handlePause = () => {
      console.log('Lecture vidéo mise en pause:', currentVideo);
      if (!isTransitioning) {
        setLoadingStatus('paused');
      }
    };
    
    const handleError = (e: Event) => {
      console.error('Erreur vidéo détectée:', e);
      console.error('Source de la vidéo:', currentVideo);
      setLoadingStatus('error');
    };
    
    const handleWaiting = () => {
      console.log('Vidéo en attente de données:', currentVideo);
      setLoadingStatus('waiting');
    };

    // Attacher les gestionnaires d'événements
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('playing', handlePlaying);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('waiting', handleWaiting);

    // Nettoyer les gestionnaires d'événements
    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('playing', handlePlaying);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('waiting', handleWaiting);
    };
  }, [videoRef, currentVideo, isTransitioning]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0 bg-black">
      {/* Indicateur de chargement/statut */}
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
      
      {/* Vidéo en fond - maintenant complètement responsive */}
      <div className="absolute inset-0 flex items-center justify-center w-full h-full">
        <video
          ref={videoRef}
          className="w-auto h-auto max-w-full max-h-full"
          poster={fallbackImg}
          playsInline
          muted
          preload="auto"
        >
          <source src={currentVideo} type="video/mp4" />
        </video>
      </div>
      
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
