
import { useEffect } from "react";
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

  // Gestion du changement de vidéo lorsque le mode UV change
  useEffect(() => {
    // Inversion des vidéos selon l'état d'UV
    const newVideoUrl = uvMode ? videoUrl : videoUrlUV;
    
    if (currentVideo !== newVideoUrl) {
      console.log(`Mode UV ${uvMode ? 'activé' : 'désactivé'}, vidéo changée pour ${newVideoUrl}`);
      setCurrentVideo(newVideoUrl);
      
      // Jouer la transition vidéo immédiatement quand le mode UV change
      if (isTorchActive) {
        setTimeout(() => playVideoTransition(), 50); // Petit délai pour s'assurer que currentVideo est mis à jour
      }
    }
  }, [uvMode, videoUrl, videoUrlUV, currentVideo, setCurrentVideo, playVideoTransition, isTorchActive]);

  return { uvMode, isTorchActive };
}
