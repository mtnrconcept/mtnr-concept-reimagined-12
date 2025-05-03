
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
      
      // Forcer une mise à jour des éléments qui dépendent de la torche
      requestAnimationFrame(() => {
        const torchElements = document.querySelectorAll('.torch-dependent, .uv-hidden-message, .uv-secret-message');
        torchElements.forEach(el => {
          if (el instanceof HTMLElement) {
            // Forcer un repaint
            el.style.display = el.style.display;
          }
        });
      });
    } else {
      document.body.classList.remove('torch-active');
      
      // S'assurer que les éléments UV sont bien cachés
      const uvElements = document.querySelectorAll('.uv-hidden-message, .uv-secret-message');
      uvElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.classList.remove('visible');
        }
      });
    }
    
    // Force refresh du DOM après un court délai pour s'assurer que les changements sont appliqués
    setTimeout(() => {
      const event = new Event('torch-state-changed');
      document.dispatchEvent(event);
    }, 50);
  }, [isTorchActive, isFirstLoad]);
}
