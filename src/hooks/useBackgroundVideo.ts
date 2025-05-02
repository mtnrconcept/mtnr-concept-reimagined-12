
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
  
  // États locaux avec valeurs initiales
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasUserInteraction, setHasUserInteraction] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  // Définir le bon chemin de vidéo basé sur le mode UV
  const currentVideo = useMemo(() => {
    return uvMode ? videoUrlUV : videoUrl;
  }, [uvMode, videoUrl, videoUrlUV]);

  // S'assurer que les URL des vidéos sont correctes
  useEffect(() => {
    console.log('URL de la vidéo courante:', currentVideo);
    // Vérifier si les fichiers de vidéo existent
    fetch(currentVideo)
      .then(response => {
        if (!response.ok) {
          console.error(`La vidéo ${currentVideo} n'a pas pu être chargée:`, response.status);
          setVideoError(true);
        } else {
          console.log(`La vidéo ${currentVideo} existe et est accessible`);
          setVideoError(false);
        }
      })
      .catch(error => {
        console.error(`Erreur lors de la vérification de la vidéo ${currentVideo}:`, error);
        setVideoError(true);
      });
  }, [currentVideo]);

  // Fonction pour gérer la première interaction utilisateur
  const handleUserInteraction = useCallback(() => {
    if (!hasUserInteraction) {
      console.log('Interaction utilisateur détectée, vidéo prête à jouer');
      setHasUserInteraction(true);
    }
  }, [hasUserInteraction]);

  // Version optimisée de playVideoTransition avec useCallback
  const playVideoTransition = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || videoError) {
      console.error("Erreur: élément vidéo non disponible ou erreur vidéo");
      return;
    }
    
    try {
      setIsTransitioning(true);
      
      // Important: Pré-configurer la source manuellement
      if (!videoElement.src.includes(currentVideo)) {
        console.log("Mise à jour de la source vidéo:", currentVideo);
        
        // Méthode alternative pour charger la vidéo
        const sources = videoElement.getElementsByTagName('source');
        if (sources.length > 0) {
          for (let i = 0; i < sources.length; i++) {
            sources[i].src = currentVideo;
          }
        } else {
          // Si pas de sources, créer des éléments source
          const mp4Source = document.createElement('source');
          mp4Source.src = currentVideo;
          mp4Source.type = 'video/mp4';
          videoElement.appendChild(mp4Source);
          
          const webmSource = document.createElement('source');
          webmSource.src = currentVideo;
          webmSource.type = 'video/webm';
          videoElement.appendChild(webmSource);
        }
        
        // Recharger pour appliquer les nouvelles sources
        videoElement.load();
        
        // Attendre que la vidéo soit chargée
        await new Promise((resolve) => {
          const loadHandler = () => {
            console.log("Vidéo chargée avec succès");
            resolve(true);
            videoElement.removeEventListener('loadeddata', loadHandler);
          };
          
          const errorHandler = (error: ErrorEvent) => {
            console.error("Erreur de chargement vidéo:", error);
            resolve(false);
            videoElement.removeEventListener('error', errorHandler);
          };
          
          videoElement.addEventListener('loadeddata', loadHandler, { once: true });
          videoElement.addEventListener('error', errorHandler, { once: true });
          
          // Timeout en cas de problème de chargement
          setTimeout(() => {
            console.warn("Délai de chargement vidéo dépassé");
            resolve(false);
            videoElement.removeEventListener('loadeddata', loadHandler);
            videoElement.removeEventListener('error', errorHandler);
          }, 5000);
        });
      }
      
      // Remettre la vidéo au début
      videoElement.currentTime = 0;
      
      // Ajouter l'écouteur d'événement 'ended' avant de lancer la lecture
      const handleVideoEnded = () => {
        console.log("Vidéo terminée, mise en pause");
        videoElement.pause();
        setIsTransitioning(false);
        videoElement.removeEventListener('ended', handleVideoEnded);
      };
      
      videoElement.removeEventListener('ended', handleVideoEnded);
      videoElement.addEventListener('ended', handleVideoEnded);
      
      // Lancer la lecture de la vidéo
      console.log("Démarrage de la lecture vidéo");
      try {
        await videoElement.play();
        console.log("Vidéo en lecture");
      } catch (error) {
        console.error("Erreur de lecture vidéo:", error);
        setIsTransitioning(false);
        setVideoError(true);
      }
    } catch (error) {
      console.error("Erreur générale lors de la transition vidéo:", error);
      setIsTransitioning(false);
      setVideoError(true);
    }
  }, [currentVideo, videoError]);

  // Ajouter un logging pour débogage
  useEffect(() => {
    if (videoRef.current) {
      console.log("Statut de l'élément vidéo:", {
        paused: videoRef.current.paused,
        readyState: videoRef.current.readyState,
        networkState: videoRef.current.networkState,
        src: videoRef.current.src,
        currentSrc: videoRef.current.currentSrc,
        error: videoRef.current.error
      });
    }
  }, [isTransitioning, videoRef.current?.error]);

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
