
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
  const transitionRequestedRef = useRef(false);

  // Gestion du changement de vidéo lorsque le mode UV change
  useEffect(() => {
    // Vérifier si le mode UV a réellement changé
    if (previousUVModeRef.current !== uvMode) {
      previousUVModeRef.current = uvMode;
      
      // Sélectionner la bonne vidéo selon le mode UV
      const newVideoUrl = uvMode ? videoUrlUV : videoUrl;
      
      console.log(`Mode UV ${uvMode ? 'activé' : 'désactivé'}, vidéo sélectionnée: ${newVideoUrl}`);
      setCurrentVideo(newVideoUrl);
      
      // Toujours jouer la transition vidéo quand le mode UV change, que la torche soit active ou non
      if (!transitionRequestedRef.current) {
        transitionRequestedRef.current = true;
        setTimeout(() => {
          playVideoTransition();
          console.log(`Lancement de la transition vidéo pour: ${newVideoUrl}`);
          // Réinitialisation après un délai
          setTimeout(() => {
            transitionRequestedRef.current = false;
          }, 1000);
        }, 50);
      }
    }
  }, [uvMode, videoUrl, videoUrlUV, currentVideo, setCurrentVideo, playVideoTransition, isTorchActive]);

  return { uvMode, isTorchActive };
}
