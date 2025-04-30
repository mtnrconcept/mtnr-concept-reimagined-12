
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUVMode } from '@/components/effects/UVModeContext';
import { useTorch } from '@/components/effects/TorchContext';

interface UseBackgroundVideoProps {
  videoUrl: string;
  videoUrlUV: string;
}

export const useBackgroundVideo = ({ videoUrl, videoUrlUV }: UseBackgroundVideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { uvMode } = useUVMode();
  const { isTorchActive } = useTorch();
  
  // États locaux avec valeurs initiales correctes
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasUserInteraction, setHasUserInteraction] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  // Définir le bon chemin de vidéo basé sur le mode UV
  const currentVideo = useMemo(() => {
    const selectedUrl = uvMode ? videoUrlUV : videoUrl;
    // Vérifier si l'URL commence par un slash et ne contient pas déjà lovable-uploads
    if (!selectedUrl.includes('lovable-uploads') && selectedUrl.startsWith('/')) {
      // Assurer que le chemin est correct
      return `/lovable-uploads/${selectedUrl.replace(/^\/+/, '')}`;
    }
    return selectedUrl;
  }, [uvMode, videoUrl, videoUrlUV]);

  // Fonction pour gérer la première interaction utilisateur
  const handleUserInteraction = useCallback(() => {
    if (!hasUserInteraction) {
      console.log('Interaction utilisateur détectée, vidéo prête à jouer');
      setHasUserInteraction(true);
    }
  }, [hasUserInteraction]);

  // Vérifier si les vidéos existent
  useEffect(() => {
    const checkVideoAvailability = async () => {
      try {
        const response = await fetch(currentVideo, { method: 'HEAD' });
        if (!response.ok) {
          console.error(`La vidéo n'est pas disponible: ${currentVideo}`);
          setVideoError(true);
        } else {
          setVideoError(false);
        }
      } catch (error) {
        console.error(`Erreur lors de la vérification de la vidéo: ${currentVideo}`, error);
        setVideoError(true);
      }
    };
    
    checkVideoAvailability();
  }, [currentVideo]);

  // Version optimisée de playVideoTransition avec useCallback
  const playVideoTransition = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || isTransitioning || videoError) {
      console.log('Impossible de démarrer la vidéo: vidéo non chargée, transition déjà en cours ou erreur vidéo');
      return;
    }
    
    try {
      console.log('Tentative de transition vidéo - Mode UV:', uvMode);
      setIsTransitioning(true);
      
      // Vider le cache avant de jouer
      if (videoElement.src !== currentVideo) {
        console.log('Changement de source vidéo vers:', currentVideo);
        
        // Retirer l'ancienne source et vider le cache
        videoElement.removeAttribute('src');
        videoElement.load();
        
        // Définir la nouvelle source
        videoElement.src = currentVideo;
        
        // Ajouter un gestionnaire d'erreurs
        const errorHandler = () => {
          console.error('Erreur lors du chargement de la vidéo:', currentVideo);
          setVideoError(true);
          setIsTransitioning(false);
          videoElement.removeEventListener('error', errorHandler);
        };
        videoElement.addEventListener('error', errorHandler);
        
        // Attendre que les métadonnées soient chargées avant de continuer
        if (videoElement.readyState < 2) {
          await new Promise<void>((resolve) => {
            const handleMetadata = () => {
              videoElement.removeEventListener('loadedmetadata', handleMetadata);
              resolve();
            };
            videoElement.addEventListener('loadedmetadata', handleMetadata);
            
            // Timeout si les métadonnées ne se chargent pas
            setTimeout(() => {
              videoElement.removeEventListener('loadedmetadata', handleMetadata);
              resolve();
            }, 2000);
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
          videoElement.currentTime = videoElement.duration - 0.1; // Maintenir la dernière image
        }
        setIsTransitioning(false);
        videoElement.removeEventListener('ended', handleVideoEnded);
      };
      
      videoElement.removeEventListener('ended', handleVideoEnded);
      videoElement.addEventListener('ended', handleVideoEnded);
      
      console.log('Lecture de la vidéo...');
      await videoElement.play().catch(error => {
        console.error('Erreur lors de la lecture:', error);
        setIsTransitioning(false);
        setVideoError(true);
      });
      console.log('Vidéo démarrée avec succès');
    } catch (error) {
      console.error('Erreur lors de la lecture de la vidéo:', error);
      setIsTransitioning(false);
      setVideoError(true);
    }
  }, [isTransitioning, currentVideo, uvMode, videoError]);

  // Démarrer automatiquement la vidéo lors du premier chargement
  useEffect(() => {
    if (isFirstLoad && videoRef.current && !videoError) {
      // Démarrer la transition après le premier rendu complet
      const timer = setTimeout(() => {
        handleUserInteraction();
        if (!isTransitioning) {
          console.log('Démarrage automatique de la vidéo au chargement initial');
          playVideoTransition();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstLoad, isTransitioning, handleUserInteraction, playVideoTransition, videoError]);

  return {
    videoRef,
    isFirstLoad,
    setIsFirstLoad,
    isTransitioning,
    setIsTransitioning,
    hasUserInteraction,
    setHasUserInteraction,
    currentVideo,
    handleUserInteraction,
    playVideoTransition,
    uvMode,
    isTorchActive,
    videoError
  };
};
