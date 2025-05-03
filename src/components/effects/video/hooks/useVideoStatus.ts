
import { useState, useRef, useEffect } from 'react';
import { useUVMode } from '../../UVModeContext';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '../../NavigationContext';
import { isResourceCached } from '@/lib/preloader';

export function useVideoStatus(
  videoUrl: string = "/lovable-uploads/videonormale.mp4",
  videoUrlUV: string = "/lovable-uploads/videouv.mp4"
) {
  // Références pour les éléments vidéo
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [loadingStatus, setLoadingStatus] = useState<'loading' | 'ready' | 'waiting' | 'error'>('loading');
  const [videoError, setVideoError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const navigation = useNavigation();
  
  // Référence pour stocker le chemin précédent
  const previousPathRef = useRef(location.pathname);
  
  // Utilisation du contexte UV pour déterminer quelle vidéo afficher
  const { uvMode } = useUVMode();

  // Signal au reste de l'application que la vidéo est prête
  const [videoReady, setVideoReady] = useState(false);
  
  // Référence pour suivre si c'est le premier chargement
  const isFirstMountRef = useRef(true);

  // Effet pour initialiser la vidéo au chargement
  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;
    
    // Configuration initiale de la vidéo
    const setupVideo = async () => {
      try {
        // Définir la source vidéo en fonction du mode UV
        const currentVideoUrl = uvMode ? videoUrlUV : videoUrl;
        video.src = currentVideoUrl;
        
        // Vérifier si la vidéo est préchargée
        const isCached = isResourceCached('video', currentVideoUrl);
        console.log(`La vidéo ${currentVideoUrl} est-elle en cache? ${isCached ? 'Oui' : 'Non'}`);
        
        // Optimisations pour le chargement
        video.preload = 'auto';
        
        if (isFirstMountRef.current) {
          // Au tout premier montage, on force le préchargement
          if (typeof window !== 'undefined' && window.__forcePrecacheVideos) {
            window.__forcePrecacheVideos();
          }
          isFirstMountRef.current = false;
        }
        
        // Chargement initial de la vidéo mais sans lecture
        video.load();
        video.pause();
        
        setLoadingStatus('ready');
        // Signal que la vidéo est prête initialement
        setVideoReady(true);
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
    
    // Marquer la vidéo comme non prête pendant le changement
    setVideoReady(false);
    
    // Changer la source vidéo immédiatement quand le mode UV change
    const currentVideoUrl = uvMode ? videoUrlUV : videoUrl;
    video.src = currentVideoUrl;
    
    // Vérifier si la vidéo est préchargée
    const isCached = isResourceCached('video', currentVideoUrl);
    console.log(`Changement de mode UV - La vidéo ${currentVideoUrl} est-elle en cache? ${isCached ? 'Oui' : 'Non'}`);
    
    // Si la vidéo n'est pas en cache, forcer le préchargement
    if (!isCached && typeof window !== 'undefined' && window.__forcePrecacheVideos) {
      window.__forcePrecacheVideos();
    }
    
    video.load();
    
    // S'assurer que la vidéo reste en pause
    setTimeout(() => {
      if (video) {
        video.pause();
        // Signaler que la nouvelle source est prête
        setVideoReady(true);
      }
    }, 100);
    
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
      
      // Marquer la vidéo comme non prête pendant la transition
      setVideoReady(false);
      setIsTransitioning(true);
      
      // Vérifier si la vidéo courante est en cache
      const currentVideoUrl = uvMode ? videoUrlUV : videoUrl;
      const isCached = isResourceCached('video', currentVideoUrl);
      
      if (!isCached) {
        console.log(`La vidéo ${currentVideoUrl} n'est pas en cache, forçage du préchargement`);
        if (typeof window !== 'undefined' && window.__forcePrecacheVideos) {
          window.__forcePrecacheVideos();
        }
      }
      
      // Remettre la vidéo au début et lancer la lecture
      video.currentTime = 0;
      
      // Utilisation de setTimeout pour laisser le temps au navigateur de finaliser le préchargement
      setTimeout(() => {
        video.play()
          .then(() => {
            console.log('Lecture de la vidéo démarrée pour transition de page');
          })
          .catch(err => console.error('Erreur de lecture vidéo:', err));
      }, 10);
    }
  }, [location.pathname, videoUrl, videoUrlUV, uvMode]);

  // Écouter les événements de navigation (via NavigationContext)
  useEffect(() => {
    const handleTransition = () => {
      const video = videoRef.current;
      
      if (!video) return;
      
      // Marquer la vidéo comme non prête pendant la transition
      setVideoReady(false);
      setIsTransitioning(true);
      
      // Vérifier si la vidéo courante est en cache
      const currentVideoUrl = uvMode ? videoUrlUV : videoUrl;
      const isCached = isResourceCached('video', currentVideoUrl);
      
      if (!isCached) {
        console.log(`La vidéo ${currentVideoUrl} n'est pas en cache, forçage du préchargement`);
        if (typeof window !== 'undefined' && window.__forcePrecacheVideos) {
          window.__forcePrecacheVideos();
        }
      }
      
      // Remettre la vidéo au début et lancer la lecture
      video.currentTime = 0;
      
      // Utilisation de setTimeout pour laisser le temps au navigateur de finaliser le préchargement
      setTimeout(() => {
        video.play()
          .then(() => console.log('Lecture de la vidéo démarrée (via navigationContext)'))
          .catch(err => console.error('Erreur de lecture vidéo:', err));
      }, 10);
    };
    
    // S'abonner au contexte de navigation pour les transitions
    const unregister = navigation.registerVideoTransitionListener(handleTransition);
    return unregister;
  }, [navigation, videoUrl, videoUrlUV, uvMode]);

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
      // Signaler que la vidéo est prête après la fin de la transition
      setVideoReady(true);
      // Mettre en pause la vidéo lorsqu'elle est terminée
      video.pause();
    };
    
    const handleError = (e: Event) => {
      console.error('Erreur vidéo détectée:', e);
      setVideoError(true);
      setLoadingStatus('error');
      // En cas d'erreur, considérer la vidéo comme "prête" pour ne pas bloquer l'interface
      setVideoReady(true);
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

  // Exposer l'état de préparation de la vidéo au contexte global
  useEffect(() => {
    // Cette partie est mise à jour pour utiliser la propriété que nous avons déclarée dans global.d.ts
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
