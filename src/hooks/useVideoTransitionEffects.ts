
import { useEffect, useCallback } from 'react';
import { useNavigation } from '@/components/effects/NavigationContext';
import { UseBackgroundVideoReturn } from './video/types';

export const useVideoTransitionEffects = (backgroundVideo: UseBackgroundVideoReturn) => {
  const {
    videoRef,
    isFirstLoad,
    setIsFirstLoad,
    isTransitioning,
    hasUserInteraction,
    currentVideo,
    playVideoTransition,
    handleUserInteraction,
  } = backgroundVideo;
  
  const navigation = useNavigation();

  // Fonction qui exécute la transition si les conditions sont réunies
  const executeTransition = useCallback(() => {
    if (!hasUserInteraction) {
      handleUserInteraction();
      console.log('Première interaction, préparation de la transition vidéo');
      setTimeout(() => playVideoTransition(), 100);
    } else if (!isTransitioning) {
      console.log('Exécution de la transition vidéo');
      playVideoTransition();
    }
  }, [hasUserInteraction, isTransitioning, playVideoTransition, handleUserInteraction]);

  // Écouter les événements de navigation
  useEffect(() => {
    const unregister = navigation.registerVideoTransitionListener(() => {
      console.log("Transition vidéo déclenchée par navigation");
      executeTransition();
    });
    
    return unregister;
  }, [navigation, executeTransition]);
  
  // Initialisation et démarrage de la vidéo
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Configuration initiale
    if (isFirstLoad) {
      console.log("Premier chargement de la vidéo");
      
      const initializeVideo = async () => {
        // Configurer la vidéo
        videoElement.playsInline = true;
        videoElement.muted = true;
        videoElement.loop = true;
        videoElement.autoplay = true;
        
        // S'assurer que les sources sont correctement définies
        if (!videoElement.src && videoElement.getElementsByTagName('source').length === 0) {
          videoElement.src = currentVideo;
          videoElement.load();
        }
        
        // Tentative de lecture immédiate
        try {
          await videoElement.play();
          console.log("Lecture vidéo démarrée avec succès");
        } catch (error) {
          console.warn("Lecture automatique impossible, attente d'interaction:", error);
        }
      };
      
      initializeVideo();
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, videoRef, setIsFirstLoad, currentVideo]);
  
  // Force d'autoplay après un délai court (parfois nécessaire pour Safari)
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || isFirstLoad) return;
    
    const delayedPlay = setTimeout(() => {
      if (videoElement.paused) {
        videoElement.play().catch(err => 
          console.warn("Tentative de lecture retardée échouée:", err)
        );
      }
    }, 1000);
    
    return () => clearTimeout(delayedPlay);
  }, [isFirstLoad, videoRef]);
  
  // Ajout des écouteurs pour la première interaction utilisateur
  useEffect(() => {
    if (hasUserInteraction) return;
    
    const handleInteraction = () => {
      handleUserInteraction();
      
      // Tenter de jouer la vidéo après l'interaction
      if (videoRef.current) {
        videoRef.current.play().catch(err => 
          console.warn("Erreur lors de la lecture après interaction:", err)
        );
      }
    };
    
    // Ajouter les écouteurs d'événements - plus d'événements pour capter toute interaction
    const events = ['click', 'touchstart', 'touchend', 'keydown', 'scroll', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true });
    });
    
    return () => {
      // Nettoyer les écouteurs
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [handleUserInteraction, hasUserInteraction, videoRef]);
};
