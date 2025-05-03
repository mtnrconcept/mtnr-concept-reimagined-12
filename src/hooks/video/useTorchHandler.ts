
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
  // S'assurer que la torche standard reste active même en mode UV
  useEffect(() => {
    // Débugger le statut de la torche
    console.log(`Statut torche modifié: ${isTorchActive ? 'active' : 'inactive'}`);
    
    // Garder la torche classique visible même si le mode UV est actif
    if (isTorchActive) {
      document.body.classList.add('torch-active');
    } else {
      document.body.classList.remove('torch-active');
    }
  }, [isTorchActive, isFirstLoad]);
}
