
import { useEffect, useRef } from "react";
import { useUVMode } from "../../components/effects/UVModeContext";
import { useTorch } from "../../components/effects/TorchContext";
import { VideoState, VideoActions } from "./types";

interface UseUVModeChangeProps {
  videoUrl: string;
  videoUrlUV: string;
  videoState: Pick<VideoState, "currentVideo">;
  videoActions: Pick<VideoActions, "setCurrentVideo">;
}

export function useUVModeChange({
  videoUrl,
  videoUrlUV,
  videoState,
  videoActions,
}: UseUVModeChangeProps) {
  const { uvMode } = useUVMode();
  const { isTorchActive } = useTorch();
  const { currentVideo } = videoState;
  const { setCurrentVideo } = videoActions;
  const previousUVModeRef = useRef(uvMode);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);

  // Nettoyage des timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Gestion du changement de mode UV
  useEffect(() => {
    // Éviter le traitement répétitif
    if (isProcessingRef.current) return;
    
    // Vérifier si le mode UV a réellement changé
    if (previousUVModeRef.current !== uvMode) {
      isProcessingRef.current = true;
      previousUVModeRef.current = uvMode;
      
      // Mettre à jour la source vidéo en fonction du mode UV
      const newVideoUrl = uvMode ? videoUrlUV : videoUrl;
      
      if (currentVideo !== newVideoUrl) {
        console.log(`Mode UV ${uvMode ? 'activé' : 'désactivé'}, vidéo changée pour ${newVideoUrl}`);
        setCurrentVideo(newVideoUrl);
        
        // Déclencher un événement personnalisé avec délai pour éviter les conflits
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          const event = new CustomEvent('uv-mode-changed', { detail: { uvMode } });
          document.dispatchEvent(event);
          
          // Force le repaint des éléments UV avec délai progressif
          setTimeout(() => {
            const uvElements = document.querySelectorAll('.uv-hidden-message, .uv-secret-message, .uv-ready');
            
            // Traiter les éléments par lots pour éviter les blocages
            const batchSize = 5;
            for (let i = 0; i < uvElements.length; i += batchSize) {
              const endIndex = Math.min(i + batchSize, uvElements.length);
              
              setTimeout(() => {
                for (let j = i; j < endIndex; j++) {
                  const el = uvElements[j];
                  if (el instanceof HTMLElement) {
                    // Forcer un repaint
                    el.style.visibility = el.style.visibility;
                  }
                }
              }, (i / batchSize) * 10); // Échelonner le traitement
            }
            
            isProcessingRef.current = false;
          }, 50);
        }, 50);
      } else {
        isProcessingRef.current = false;
      }
    }
  }, [uvMode, videoUrl, videoUrlUV, currentVideo, setCurrentVideo]);

  // Écouter les changements d'état de la torche pour mettre à jour les éléments UV
  useEffect(() => {
    const handleTorchChanged = () => {
      // Limiter la fréquence de traitement
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;
      
      if (uvMode && isTorchActive) {
        // Traiter les éléments UV par lots
        const uvElements = document.querySelectorAll('.uv-hidden-message, .uv-secret-message, .uv-ready');
        
        if (uvElements.length > 0) {
          const batchSize = 10;
          for (let i = 0; i < uvElements.length; i += batchSize) {
            const endIndex = Math.min(i + batchSize, uvElements.length);
            
            setTimeout(() => {
              for (let j = i; j < endIndex; j++) {
                const el = uvElements[j];
                if (el instanceof HTMLElement) {
                  el.classList.add('active');
                }
              }
              
              // Réinitialiser après le traitement du dernier lot
              if (endIndex >= uvElements.length) {
                isProcessingRef.current = false;
              }
            }, (i / batchSize) * 20);
          }
        } else {
          isProcessingRef.current = false;
        }
      } else {
        // Cacher les éléments UV avec la même approche par lots
        const uvElements = document.querySelectorAll('.uv-hidden-message, .uv-secret-message, .uv-ready');
        
        if (uvElements.length > 0) {
          const batchSize = 10;
          for (let i = 0; i < uvElements.length; i += batchSize) {
            const endIndex = Math.min(i + batchSize, uvElements.length);
            
            setTimeout(() => {
              for (let j = i; j < endIndex; j++) {
                const el = uvElements[j];
                if (el instanceof HTMLElement) {
                  el.classList.remove('active');
                }
              }
              
              // Réinitialiser après le traitement du dernier lot
              if (endIndex >= uvElements.length) {
                isProcessingRef.current = false;
              }
            }, (i / batchSize) * 20);
          }
        } else {
          isProcessingRef.current = false;
        }
      }
    };

    // Appeler une fois au montage
    handleTorchChanged();
    
    // Écouter les événements avec limitation de débit
    const throttledHandler = () => {
      if (!isProcessingRef.current) {
        handleTorchChanged();
      }
    };
    
    document.addEventListener('torch-state-changed', throttledHandler);
    
    return () => {
      document.removeEventListener('torch-state-changed', throttledHandler);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [uvMode, isTorchActive]);

  return { uvMode, isTorchActive };
}
