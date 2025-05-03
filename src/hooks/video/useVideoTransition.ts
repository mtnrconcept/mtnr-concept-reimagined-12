
import { useCallback } from "react";
import { VideoState, VideoActions } from "./types";

interface UseVideoTransitionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoState: Pick<VideoState, "isTransitioning">;
  videoActions: Pick<VideoActions, "setIsTransitioning">;
}

export function useVideoTransition({
  videoRef,
  videoState,
  videoActions,
}: UseVideoTransitionProps) {
  const { isTransitioning } = videoState;
  const { setIsTransitioning } = videoActions;

  // Fonction simplifiée qui ne fait plus de transition vidéo
  // car nous utilisons l'opacité CSS
  const playVideoTransition = useCallback((): void => {
    // Ne rien faire, les transitions sont gérées par CSS
    console.log('Transition par opacité uniquement, pas de changement de lecture vidéo');
  }, []);

  return { playVideoTransition };
}
