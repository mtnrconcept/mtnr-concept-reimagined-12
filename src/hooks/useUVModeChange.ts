
import { useEffect, useRef } from "react";
import { useUVMode } from "../components/effects/UVModeContext";
import { useTorch } from "../components/effects/TorchContext";
import { VideoState, VideoActions } from "./video/types";

interface UseUVModeChangeProps {
  videoUrl: string;
  videoUrlUV: string;
  videoState: Pick<VideoState, "currentVideo">;
  videoActions: Pick<VideoActions, "setCurrentVideo" | "playVideoTransition">;
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
  const { setCurrentVideo, playVideoTransition } = videoActions;
  const previousUVModeRef = useRef(uvMode);
  const transitionRequestedRef = useRef(false);
  const previousTorchActiveRef = useRef(isTorchActive);

  // Gestion du changement de vidéo lorsque le mode UV change
  useEffect(() => {
    // Vérifier si le mode UV a réellement changé
    if (previousUVModeRef.current !== uvMode) {
      console.log(`Changement mode UV: ${uvMode ? 'activé' : 'désactivé'}`);
      previousUVModeRef.current = uvMode;
      
      // Sélectionner la bonne vidéo selon le mode UV
      const newVideoUrl = uvMode ? videoUrlUV : videoUrl;
      
      if (currentVideo !== newVideoUrl) {
        console.log(`Mode UV ${uvMode ? 'activé' : 'désactivé'}, vidéo changée pour ${newVideoUrl}`);
        setCurrentVideo(newVideoUrl);
        
        // Jouer la transition vidéo immédiatement quand le mode UV change
        // mais uniquement si la torche est active et qu'une transition n'est pas déjà en cours
        if (isTorchActive && !transitionRequestedRef.current) {
          transitionRequestedRef.current = true;
          setTimeout(() => {
            playVideoTransition();
            // Réinitialisation après un délai
            setTimeout(() => {
              transitionRequestedRef.current = false;
            }, 1000);
          }, 50);
        }
        
        // Déclencher un événement personnalisé pour informer d'autres composants
        const event = new CustomEvent('uv-mode-changed', { detail: { uvMode } });
        document.dispatchEvent(event);
      }
    }
    
    // Réagir également aux changements de l'état de la torche
    if (previousTorchActiveRef.current !== isTorchActive) {
      previousTorchActiveRef.current = isTorchActive;
      
      // Si la torche vient d'être activée et que le mode UV est actif
      if (isTorchActive && uvMode && !transitionRequestedRef.current) {
        transitionRequestedRef.current = true;
        setTimeout(() => {
          playVideoTransition();
          setTimeout(() => {
            transitionRequestedRef.current = false;
          }, 1000);
        }, 50);
      }
    }
  }, [uvMode, videoUrl, videoUrlUV, currentVideo, setCurrentVideo, playVideoTransition, isTorchActive]);

  return { uvMode, isTorchActive };
}
