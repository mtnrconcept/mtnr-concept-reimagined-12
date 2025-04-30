
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

  // Vérifier la disponibilité des vidéos et les précharger
  useEffect(() => {
    console.log('URL de la vidéo courante:', currentVideo);
    
    const preloadVideo = async () => {
      try {
        const response = await fetch(currentVideo);
        if (!response.ok) {
          console.error(`La vidéo ${currentVideo} n'a pas pu être chargée:`, response.status);
          setVideoError(true);
        } else {
          console.log(`La vidéo ${currentVideo} existe et est accessible`);
          setVideoError(false);
          
          // Précharger la vidéo via un élément vidéo caché
          const tempVideo = document.createElement('video');
          tempVideo.preload = 'auto';
          tempVideo.src = currentVideo;
          tempVideo.load();
          
          // Éventuellement, nettoyer après préchargement
          tempVideo.onloadeddata = () => {
            console.log(`Vidéo ${currentVideo} préchargée avec succès`);
            tempVideo.remove();
          };
        }
      } catch (error) {
        console.error(`Erreur lors de la vérification de la vidéo ${currentVideo}:`, error);
        setVideoError(true);
      }
    };
    
    preloadVideo();
    
    // Configurer l'élément vidéo actuel s'il existe
    if (videoRef.current) {
      videoRef.current.src = currentVideo;
      videoRef.current.load();
    }
  }, [currentVideo]);

  // Fonction pour gérer la première interaction utilisateur
  const handleUserInteraction = useCallback(() => {
    if (!hasUserInteraction) {
      console.log('Interaction utilisateur détectée, vidéo prête à jouer');
      setHasUserInteraction(true);
      
      // Tentative de lecture automatique après interaction
      if (videoRef.current && !videoError) {
        videoRef.current.play().catch(err => {
          console.error("Erreur lors de la lecture initiale:", err);
        });
      }
    }
  }, [hasUserInteraction, videoError]);

  // Version optimisée de playVideoTransition
  const playVideoTransition = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || videoError) {
      console.error("Erreur: élément vidéo non disponible ou erreur vidéo");
      return;
    }
    
    try {
      setIsTransitioning(true);
      
      // Mise à jour directe des attributs de la vidéo
      videoElement.src = currentVideo;
      videoElement.load();
      
      // Configurer les gestionnaires d'événements
      const playPromise = new Promise<void>((resolve, reject) => {
        const onCanPlay = () => {
          videoElement.removeEventListener('canplay', onCanPlay);
          videoElement.removeEventListener('error', onError);
          
          // Tenter de jouer la vidéo
          videoElement.play()
            .then(() => {
              console.log("La vidéo est en cours de lecture");
              resolve();
            })
            .catch(error => {
              console.error("Erreur de lecture:", error);
              reject(error);
            });
        };
        
        const onError = () => {
          videoElement.removeEventListener('canplay', onCanPlay);
          videoElement.removeEventListener('error', onError);
          reject(new Error("Erreur de chargement de la vidéo"));
        };
        
        videoElement.addEventListener('canplay', onCanPlay, { once: true });
        videoElement.addEventListener('error', onError, { once: true });
        
        // Timeout de sécurité
        setTimeout(() => {
          videoElement.removeEventListener('canplay', onCanPlay);
          videoElement.removeEventListener('error', onError);
          reject(new Error("Délai de chargement dépassé"));
        }, 5000);
      });
      
      // Attendre la fin de la lecture ou attraper les erreurs
      try {
        await playPromise;
        
        // Ajouter l'écouteur pour la fin de la vidéo
        const handleVideoEnded = () => {
          console.log("Vidéo terminée");
          setIsTransitioning(false);
          videoElement.removeEventListener('ended', handleVideoEnded);
          
          // Remettre en lecture continue après la transition
          videoElement.loop = true;
          videoElement.play().catch(e => console.error("Erreur lors de la reprise en boucle:", e));
        };
        
        videoElement.removeEventListener('ended', handleVideoEnded);
        videoElement.addEventListener('ended', handleVideoEnded);
        
      } catch (error) {
        console.error("Erreur de lecture vidéo:", error);
        setIsTransitioning(false);
      }
    } catch (error) {
      console.error("Erreur générale lors de la transition vidéo:", error);
      setIsTransitioning(false);
    }
  }, [currentVideo, videoError]);

  // Loguer l'état de la vidéo pour débogage
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
