
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
  // Ne plus déclencher de transition vidéo lors de l'activation/désactivation de la torche
  // car nous utilisons CSS pour les transitions d'opacité
  useEffect(() => {
    // Ne rien faire, les transitions sont gérées par CSS
  }, [isTorchActive, isFirstLoad]);
}
