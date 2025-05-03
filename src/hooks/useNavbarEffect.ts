
import { useState, useEffect } from "react";

export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Hook optimisé qui désactive les effets de mouvement pour la navbar
 * Maintient l'interface pour compatibilité mais n'applique plus de transformation
 */
export function useNavbarEffect() {
  // On retourne une position fixe (0,0) pour éliminer tout mouvement
  // Cela améliore les performances en évitant les recalculs inutiles
  const mousePosition: MousePosition = { x: 0, y: 0 };

  return {
    mousePosition
  };
}
