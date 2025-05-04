
import { useEffect, useRef } from "react";
import { useIsMobile } from "./use-mobile";
import { useUVMode } from "../components/effects/UVModeContext";

interface MousePosition {
  x: number;
  y: number;
}

export function useUVEffects(isTorchActive: boolean, mousePosition: MousePosition) {
  const { uvMode, createUVCircle, removeUVCircle } = useUVMode();
  const neonEffectRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  // UV logic - Création de l'effet de néon violet
  useEffect(() => {
    // Créer ou enlever l'effet de cercle UV
    if (isTorchActive && uvMode) {
      createUVCircle(mousePosition);
      
      // Créer l'effet néon violet
      if (!neonEffectRef.current) {
        const neonEffect = document.createElement('div');
        neonEffect.className = 'uv-neon-effect';
        neonEffect.style.left = `${mousePosition.x}px`;
        neonEffect.style.top = `${mousePosition.y}px`;
        
        // Désactiver les transitions sur mobile pour un suivi instantané
        if (isMobile) {
          neonEffect.style.transition = 'none';
        }
        
        document.body.appendChild(neonEffect);
        neonEffectRef.current = neonEffect;
      }
    } else {
      removeUVCircle();
      
      // Supprimer l'effet néon violet
      if (neonEffectRef.current) {
        neonEffectRef.current.remove();
        neonEffectRef.current = null;
      }
    }
    
    return () => {
      removeUVCircle();
      if (neonEffectRef.current) {
        neonEffectRef.current.remove();
        neonEffectRef.current = null;
      }
    };
  }, [isTorchActive, uvMode, mousePosition, createUVCircle, removeUVCircle, isMobile]);

  return { neonEffectRef };
}
