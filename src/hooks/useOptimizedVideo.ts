
import { useState, useRef, useEffect, useCallback } from 'react';
import { useUVMode } from '../components/effects/UVModeContext';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '../components/effects/NavigationContext';

export function useOptimizedVideo(
  videoUrl: string = "/lovable-uploads/videonormale.mp4",
  videoUrlUV: string = "/lovable-uploads/videouv.mp4"
) {
  // Références et états
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadingStatus, setLoadingStatus] = useState<'loading' | 'ready' | 'waiting' | 'error'>('loading');
  const [videoError, setVideoError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  
  const location = useLocation();
  const navigation = useNavigation();
  const previousPathRef = useRef(location.pathname);
  const { uvMode } = useUVMode();

  // Optimiser les gestionnaires d'événements vidéo avec useCallback
  const handleCanPlay = useCallback(() => {
    console.log('Vidéo prête à être lue:', videoRef.current?.src);
    setLoadingStatus('ready');
    setVideoReady(true);
  }, []);
  
  const handlePlaying = useCallback(() => {
    console.log('Lecture vidéo démarrée:', videoRef.current?.src);
    setLoadingStatus('ready');
  }, []);
  
  const handlePause = useCallback(() => {
    console.log('Lecture vidéo mise en pause:', videoRef.current?.src);
  }, []);
  
  const handleEnded = useCallback(() => {
    console.log('Vidéo terminée, mise en pause automatique');
    setIsTransitioning(false);
    setVideoReady(true);
    videoRef.current?.pause();
  }, []);
  
  const handleError = useCallback((e: Event) => {
    console.error('Erreur vidéo détectée:', e);
    setVideoError(true);
    setLoadingStatus('error');
    setVideoReady(true);
  }, []);
  
  const handleWaiting = useCallback(() => {
    console.log('Vidéo en attente de données:', videoRef.current?.src);
    setLoadingStatus('waiting');
  }, []);

  // Initialisation de la vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Configuration initiale de la vidéo
    const setupVideo = async () => {
      try {
        video.src = uvMode ? videoUrlUV : videoUrl;
        
        // S'assurer que l'élément vidéo est visible
        video.style.opacity = "1";
        video.style.visibility = "visible";
        video.style.zIndex = "0";
        
        video.load();
        
        // Tenter de lire la vidéo
        try {
          await video.play();
          console.log("Lecture vidéo démarrée automatiquement");
        } catch (playError) {
          // La lecture auto n'a pas fonctionné, ce n'est pas grave
          console.log("Lecture auto non autorisée, vidéo mise en pause");
          video.pause();
        }
        
        setLoadingStatus('ready');
        setVideoReady(true);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la vidéo:', error);
        setVideoError(true);
        setLoadingStatus('error');
      }
    };
    
    setupVideo();
  }, [videoUrl, videoUrlUV, uvMode]);

  // Mise à jour de la source vidéo lors du changement de mode UV
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    setVideoReady(false);
    
    // Définir la source en fonction du mode UV
    const newVideoSrc = uvMode ? videoUrlUV : videoUrl;
    
    if (video.src !== newVideoSrc) {
      console.log(`Changement de vidéo: ${newVideoSrc}, Mode UV: ${uvMode ? 'activé' : 'désactivé'}`);
      video.src = newVideoSrc;
      
      // S'assurer que l'élément vidéo est visible
      video.style.opacity = "1";
      video.style.visibility = "visible";
      video.style.zIndex = "0";
      
      video.load();
      
      // Tenter de lire la vidéo
      video.play()
        .then(() => console.log("Lecture vidéo démarrée après changement UV"))
        .catch(err => {
          console.log("Lecture auto non autorisée après changement UV");
          video.pause(); // Mettre en pause si la lecture auto échoue
        });
    }
  }, [uvMode, videoUrl, videoUrlUV]);

  // Gestion des changements de page
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (location.pathname !== previousPathRef.current) {
      console.log(`Navigation: ${previousPathRef.current} -> ${location.pathname}`);
      previousPathRef.current = location.pathname;
      
      setVideoReady(false);
      setIsTransitioning(true);
      
      // S'assurer que la vidéo est visible
      video.style.opacity = "1";
      video.style.visibility = "visible";
      video.style.zIndex = "0";
      
      video.currentTime = 0;
      video.play()
        .then(() => console.log('Lecture vidéo démarrée pour transition'))
        .catch(err => console.error('Erreur lecture:', err));
    }
  }, [location.pathname]);

  // Écouter les événements de navigation
  useEffect(() => {
    const handleTransition = () => {
      const video = videoRef.current;
      if (!video) return;
      
      setVideoReady(false);
      setIsTransitioning(true);
      
      // S'assurer que la vidéo est visible
      video.style.opacity = "1";
      video.style.visibility = "visible";
      video.style.zIndex = "0";
      
      video.currentTime = 0;
      video.play()
        .catch(err => console.error('Erreur lecture vidéo:', err));
    };
    
    const unregister = navigation.registerVideoTransitionListener(handleTransition);
    return unregister;
  }, [navigation]);

  // Gestion des événements vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
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
  }, [handleCanPlay, handlePlaying, handlePause, handleEnded, handleError, handleWaiting]);

  // Exposer l'état de préparation de la vidéo au contexte global
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__videoReady = videoReady;
    }
  }, [videoReady]);

  return {
    videoRef,
    loadingStatus,
    videoError,
    isTransitioning,
    uvMode,
    videoReady
  };
}
