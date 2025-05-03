
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
  // Nous utilisons uniquement l'opacité CSS pour la transition entre les vidéos
  useEffect(() => {
    // Ne déclencher aucune lecture de vidéo quand la torche est activée/désactivée
    // La lecture est déclenchée uniquement lors des changements de page
  }, [isTorchActive, isFirstLoad]);
}
