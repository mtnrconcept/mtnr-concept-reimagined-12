
import { useEffect } from "react";
import { VideoActions } from "./types";

interface UseTorchHandlerProps {
  isTorchActive: boolean;
  isFirstLoad: boolean;
  playVideoTransition: VideoActions["playVideoTransition"];
}

export function useTorchHandler({
  isTorchActive,
  isFirstLoad,
  playVideoTransition,
}: UseTorchHandlerProps) {
  // Jouer la vidéo quand la torche est activée/désactivée
  useEffect(() => {
    if (!isFirstLoad) {
      // Ne pas changer de vidéo ici, juste jouer la transition
      playVideoTransition();
    }
  }, [isTorchActive, isFirstLoad, playVideoTransition]);
}
