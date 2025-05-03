
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

  // Gestion du changement de mode UV
  useEffect(() => {
    // Vérifier si le mode UV a réellement changé
    if (previousUVModeRef.current !== uvMode) {
      previousUVModeRef.current = uvMode;
      
      // Mettre à jour la source vidéo en fonction du mode UV
      const newVideoUrl = uvMode ? videoUrlUV : videoUrl;
      
      if (currentVideo !== newVideoUrl) {
        console.log(`Mode UV ${uvMode ? 'activé' : 'désactivé'}, vidéo changée pour ${newVideoUrl}`);
        setCurrentVideo(newVideoUrl);
        
        // Déclencher un événement personnalisé pour informer d'autres composants
        const event = new CustomEvent('uv-mode-changed', { detail: { uvMode } });
        document.dispatchEvent(event);
        
        // Force le repaint des éléments UV
        setTimeout(() => {
          const uvElements = document.querySelectorAll('.uv-hidden-message, .uv-secret-message, .uv-ready');
          uvElements.forEach(el => {
            if (el instanceof HTMLElement) {
              // Forcer un repaint
              el.style.visibility = el.style.visibility;
            }
          });
        }, 50);
      }
    }
  }, [uvMode, videoUrl, videoUrlUV, currentVideo, setCurrentVideo]);

  // Écouter les changements d'état de la torche pour mettre à jour les éléments UV
  useEffect(() => {
    const handleTorchChanged = () => {
      if (uvMode && isTorchActive) {
        // Révéler les éléments UV quand la torche et le mode UV sont tous deux actifs
        const uvElements = document.querySelectorAll('.uv-hidden-message, .uv-secret-message, .uv-ready');
        uvElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.classList.add('active');
          }
        });
      } else {
        // Cacher les éléments UV si la torche est inactive ou le mode UV est désactivé
        const uvElements = document.querySelectorAll('.uv-hidden-message, .uv-secret-message, .uv-ready');
        uvElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.classList.remove('active');
          }
        });
      }
    };

    // Appeler une fois au montage et à chaque changement
    handleTorchChanged();
    
    // Écouter les événements de changement de torche
    document.addEventListener('torch-state-changed', handleTorchChanged);
    
    return () => {
      document.removeEventListener('torch-state-changed', handleTorchChanged);
    };
  }, [uvMode, isTorchActive]);

  return { uvMode, isTorchActive };
}
