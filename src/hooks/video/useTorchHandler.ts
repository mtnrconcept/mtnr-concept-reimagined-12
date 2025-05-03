
import { useEffect, useRef } from "react";
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
  // Référence pour éviter les appels multiples
  const isHandlingRef = useRef(false);
  
  // S'assurer que la torche standard reste active même en mode UV
  useEffect(() => {
    // Éviter les opérations DOM excessives
    if (isHandlingRef.current) return;
    
    isHandlingRef.current = true;
    console.log(`Statut torche modifié: ${isTorchActive ? 'active' : 'inactive'}`);
    
    // Utiliser RAF pour éviter les problèmes de performance
    requestAnimationFrame(() => {
      if (isTorchActive) {
        document.body.classList.add('torch-active');
      } else {
        document.body.classList.remove('torch-active');
        
        // S'assurer que les éléments UV sont bien cachés
        const uvElements = document.querySelectorAll('.uv-hidden-message, .uv-secret-message');
        uvElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.classList.remove('visible');
            el.classList.remove('active');
          }
        });
      }
      
      // Notifier les autres composants - une seule fois
      const event = new Event('torch-state-changed');
      document.dispatchEvent(event);
      
      // Réinitialiser le flag après un délai pour permettre d'autres changements
      setTimeout(() => {
        isHandlingRef.current = false;
      }, 100);
    });
    
    return () => {
      isHandlingRef.current = false;
    };
  }, [isTorchActive]);
}
