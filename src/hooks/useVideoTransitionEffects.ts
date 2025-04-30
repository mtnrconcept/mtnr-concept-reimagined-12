
import { useEffect, useCallback, useRef } from 'react';
import { useNavigation } from '@/components/effects/NavigationContext';

interface UseVideoTransitionEffectsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isFirstLoad: boolean;
  setIsFirstLoad: (value: boolean) => void;
  isTransitioning: boolean;
  hasUserInteraction: boolean;
  currentVideo: string;
  playVideoTransition: () => Promise<void>;
  handleUserInteraction: () => void;
  uvMode: boolean;
  isTorchActive: boolean | undefined;
}

export const useVideoTransitionEffects = ({
  videoRef,
  isFirstLoad,
  setIsFirstLoad,
  isTransitioning,
  hasUserInteraction,
  currentVideo,
  playVideoTransition,
  handleUserInteraction,
  uvMode,
  isTorchActive
}: UseVideoTransitionEffectsProps) => {
  const navigation = useNavigation();
  const transitionPendingRef = useRef(false);

  // Fonction qui exécute la transition si les conditions sont réunies
  const executeTransition = useCallback(() => {
    if (transitionPendingRef.current) return;
    
    transitionPendingRef.current = true;
    
    if (hasUserInteraction && !isTransitioning) {
      console.log("Démarrage de la transition vidéo suite à un événement de navigation");
      playVideoTransition().finally(() => {
        transitionPendingRef.current = false;
      });
    } else if (!hasUserInteraction) {
      console.log("Interaction utilisateur requise pour jouer la vidéo - mémorisation de l'action");
      // Simuler une interaction utilisateur pour permettre la lecture automatique
      handleUserInteraction();
      // Planifier la transition après un court délai
      setTimeout(() => {
        playVideoTransition().finally(() => {
          transitionPendingRef.current = false;
        });
      }, 100);
    }
  }, [hasUserInteraction, isTransitioning, playVideoTransition, handleUserInteraction]);

  // Effet pour les changements de mode UV uniquement
  useEffect(() => {
    if (!isFirstLoad && isTorchActive && hasUserInteraction) {
      console.log("Mode UV changé à:", uvMode, "- Lancement de la transition...");
      // Utiliser setTimeout pour éviter les problèmes de timing
      const timer = setTimeout(() => playVideoTransition(), 100);
      return () => clearTimeout(timer);
    }
  }, [uvMode, isFirstLoad, playVideoTransition, isTorchActive, hasUserInteraction]);

  // Écouter les événements de navigation
  useEffect(() => {
    console.log("Enregistrement du listener de transition vidéo");
    const unregister = navigation.registerVideoTransitionListener(() => {
      console.log("Événement de navigation détecté, lancement de la transition vidéo");
      executeTransition();
    });
    
    return unregister;
  }, [navigation, executeTransition]);
  
  // Écouter l'activation de la torche
  useEffect(() => {
    if (!isFirstLoad && isTorchActive !== undefined && hasUserInteraction) {
      // Si la torche vient d'être activée, s'assurer que la bonne vidéo est sélectionnée
      const videoElement = videoRef.current;
      if (videoElement && videoElement.src !== currentVideo) {
        console.log("Torche changée, mise à jour de la source vidéo:", currentVideo);
        videoElement.src = currentVideo;
        videoElement.load();
      }
    }
  }, [isTorchActive, isFirstLoad, currentVideo, hasUserInteraction, videoRef]);
  
  // Initialisation et gestion de la visibilité
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Nettoyage du cache de la vidéo pour éviter les problèmes de lecture
    if (videoElement.src && videoElement.src !== currentVideo) {
      // Vider le cache avant de changer la source
      videoElement.removeAttribute('src');
      videoElement.load();
      
      // Définir la nouvelle source
      videoElement.src = currentVideo;
    } else if (!videoElement.src) {
      videoElement.src = currentVideo;
    }
    
    if (isFirstLoad) {
      videoElement.load();
      videoElement.pause();
      videoElement.currentTime = 0;
      setIsFirstLoad(false);
      console.log('Vidéo initialisée avec source:', currentVideo);
    }
    
    // Ajout des écouteurs pour la première interaction utilisateur
    const handleInteraction = () => {
      handleUserInteraction();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    
    // Gestion de la visibilité de la page
    const handleVisibilityChange = () => {
      if (!videoElement) return;
      
      if (document.hidden) {
        videoElement.pause();
      } else if (!isFirstLoad && isTransitioning && hasUserInteraction) {
        videoElement.play().catch(err => {
          console.error('Erreur lors de la reprise de lecture:', err);
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      
      if (videoElement) {
        videoElement.pause();
      }
    };
  }, [isFirstLoad, isTransitioning, currentVideo, handleUserInteraction, hasUserInteraction, videoRef, setIsFirstLoad]);
};
