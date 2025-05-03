
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
  // La vidéo reste en pause et seule la source est changée
  useEffect(() => {
    // Ne rien faire lorsque la torche est activée/désactivée
    // Le changement de vidéo se fait via useUVModeChange sans lecture
    console.log(`Statut torche modifié: ${isTorchActive ? 'active' : 'inactive'}, aucune lecture vidéo déclenchée`);
  }, [isTorchActive, isFirstLoad]);
}
