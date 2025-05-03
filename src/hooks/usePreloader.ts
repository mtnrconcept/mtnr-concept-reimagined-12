
import { useEffect, useState, useCallback } from 'react';
import { initializePreloader } from '@/lib/preloader';

interface PreloaderState {
  isLoading: boolean;
  progress: number;
  hasError: boolean;
  errorMessage?: string;
}

/**
 * Hook personnalisé pour gérer le préchargement des ressources de l'application
 * @param autoStart Démarrer automatiquement le préchargement
 * @param minDisplayTime Temps minimum d'affichage de l'écran de chargement en ms
 */
export function usePreloader(autoStart = true, minDisplayTime = 2000) {
  const [state, setState] = useState<PreloaderState>({
    isLoading: true,
    progress: 0,
    hasError: false
  });

  // Fonction de démarrage du préchargement
  const startPreloading = useCallback(async () => {
    const startTime = Date.now();
    
    // Réinitialiser l'état
    setState({
      isLoading: true,
      progress: 0,
      hasError: false
    });
    
    // Simuler la progression pendant le chargement
    const progressInterval = setInterval(() => {
      setState(prevState => {
        // Calculer la progression de manière non linéaire pour donner une impression réaliste
        // Ralentir à l'approche de 90%
        const currentProgress = prevState.progress;
        let increment = 0;
        
        if (currentProgress < 50) {
          increment = 3; // Plus rapide au début
        } else if (currentProgress < 80) {
          increment = 2; // Ralentissement progressif
        } else if (currentProgress < 90) {
          increment = 0.5; // Très lent à la fin
        } else {
          increment = 0.1; // Presque arrêté avant la fin
        }
        
        const newProgress = Math.min(90, currentProgress + increment);
        
        return {
          ...prevState,
          progress: newProgress
        };
      });
    }, 100);
    
    try {
      // Démarrer le préchargement réel
      await initializePreloader();
      
      // Calculer le temps écoulé
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
      
      // S'assurer que l'écran de chargement est affiché pendant au moins minDisplayTime
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      // Finaliser la progression à 100%
      clearInterval(progressInterval);
      setState({
        isLoading: false,
        progress: 100,
        hasError: false
      });
      
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Erreur lors du préchargement:', error);
      
      setState({
        isLoading: false,
        progress: 100,
        hasError: true,
        errorMessage: error instanceof Error ? error.message : 'Erreur inconnue pendant le chargement'
      });
    }
  }, [minDisplayTime]);
  
  // Démarrer automatiquement le préchargement si autoStart est true
  useEffect(() => {
    if (autoStart) {
      startPreloading();
    }
  }, [autoStart, startPreloading]);
  
  return {
    ...state,
    startPreloading
  };
}
