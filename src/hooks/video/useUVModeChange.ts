
import { useEffect, useRef } from "react";
import { useUVMode } from "../../components/effects/UVModeContext";
import { useTorch } from "../../components/effects/TorchContext";
import { VideoState, VideoActions } from "./types";

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

  // Gestion du changement de vidéo lorsque le mode UV change
  useEffect(() => {
    // Vérifier si le mode UV a réellement changé
    if (previousUVModeRef.current !== uvMode) {
      previousUVModeRef.current = uvMode;
      
      // Sélectionner la bonne vidéo selon le mode UV
      const newVideoUrl = uvMode ? videoUrlUV : videoUrl;
      
      if (currentVideo !== newVideoUrl) {
        console.log(`Mode UV ${uvMode ? 'activé' : 'désactivé'}, vidéo changée pour ${newVideoUrl}`);
        setCurrentVideo(newVideoUrl);
        
        // Forcer la lecture immédiate de la vidéo sans condition
        // et sans délais pour un changement instantané
        setTimeout(() => {
          playVideoTransition();
        }, 0);
      }
    }
  }, [uvMode, videoUrl, videoUrlUV, currentVideo, setCurrentVideo, playVideoTransition]);

  return { uvMode, isTorchActive };
}
