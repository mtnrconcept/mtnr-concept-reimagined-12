
import React, { useEffect, useRef, useState } from 'react';
import { useBackgroundVideo } from '@/hooks/useBackgroundVideo';
import { useUVMode } from './UVModeContext';
import { useTorch } from './TorchContext';

interface BackgroundVideoProps {
  // Vous pouvez ajouter d'autres props au besoin
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = () => {
  const { uvMode } = useUVMode();
  const { isTorchActive } = useTorch();
  const [hasUserInteraction, setHasUserInteraction] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Utiliser le hook useBackgroundVideo pour gérer la lecture des vidéos
  const { videoRef, currentVideo, isTransitioning, playVideoTransition } = useBackgroundVideo({
    videoUrl: '/lovable-uploads/Composition 1.mp4',
    videoUrlUV: '/lovable-uploads/Composition 1_1.mp4',
    uvMode: uvMode,
    isTorchActive: isTorchActive
  });

  // Gérer l'interaction utilisateur
  const handleUserInteraction = () => {
    if (!hasUserInteraction) {
      console.log('Première interaction utilisateur détectée');
      setHasUserInteraction(true);
    }
  };

  // Écouter les interactions utilisateur
  useEffect(() => {
    const handleInteraction = () => {
      handleUserInteraction();
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [isFirstLoad]);

  // Effet pour jouer automatiquement la vidéo quand la torche est activée
  useEffect(() => {
    if (isTorchActive && hasUserInteraction && !isTransitioning) {
      const timer = setTimeout(() => {
        playVideoTransition();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isTorchActive, hasUserInteraction, isTransitioning, playVideoTransition]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      <video
        ref={videoRef}
        src={currentVideo}
        muted
        playsInline
        preload="auto"
        className={`w-full h-full object-cover ${isTransitioning ? 'opacity-100' : 'opacity-80'}`}
      />
    </div>
  );
};

export default BackgroundVideo;
