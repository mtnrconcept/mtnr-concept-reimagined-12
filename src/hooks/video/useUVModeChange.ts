
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
      
      // On n'a plus besoin de changer la source vidéo ici
      // car nous utilisons deux vidéos séparées avec opacité
      console.log(`Mode UV ${uvMode ? 'activé' : 'désactivé'}, transition par opacité`);
    }
  }, [uvMode]);

  return { uvMode, isTorchActive };
}
