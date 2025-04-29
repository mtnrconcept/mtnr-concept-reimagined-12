
import { useLayoutEffect, useEffect, useRef } from 'react';
import { createLogoDisperseEffect } from '@/lib/transitions/particle-effect';

// Déplacer la définition locale des options ici au lieu de l'importer
interface DisperseOptions {
  particleCount?: number;
  dispersionStrength?: number;
  duration?: number;
  colorPalette?: string[];
  onComplete?: () => void;
}

interface DispersingLogoProps {
  triggerDispersion?: boolean;
  onDispersionComplete?: () => void;
  className?: string;
  imageSrc: string;
}

/**
 * Logo dispersing component. Launches particle effect immediately on trigger.
 * Uses useLayoutEffect + requestAnimationFrame to ensure no layout jank.
 */
export const DispersingLogo = ({
  triggerDispersion = false,
  onDispersionComplete,
  className = '',
  imageSrc,
}: DispersingLogoProps) => {
  const logoRef = useRef<HTMLImageElement>(null);
  const effectRef = useRef<{ cancel: () => void } | null>(null);
  const prevTriggerRef = useRef<boolean>(false);
  const isInitialMountRef = useRef<boolean>(true);

  // Trigger dispersion immediately after layout flush, but only when going from false to true
  useLayoutEffect(() => {
    // Ignorer le premier rendu pour éviter l'animation automatique
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevTriggerRef.current = triggerDispersion;
      return;
    }

    // Ne déclencher que si triggerDispersion passe de false à true
    if (triggerDispersion && !prevTriggerRef.current && logoRef.current) {
      // Use next animation frame to avoid blocking paint
      requestAnimationFrame(() => {
        const opts: DisperseOptions = {
          particleCount: 1500, // Plus de particules pour une meilleure couverture du logo
          dispersionStrength: 1.8, // Ajusté pour une dispersion plus naturelle
          duration: 1800, // Un peu plus court mais pas trop pour garder l'effet fluide
          colorPalette: ['#FFD700', '#222222', '#FFFFFF', '#FFD700'], // Duplicate yellow for more golden particles
          onComplete: () => {
            onDispersionComplete?.();
          },
        };

        // Cancel any existing effect
        effectRef.current?.cancel();
        effectRef.current = createLogoDisperseEffect(logoRef.current!, opts);
      });
    }
    
    // Mettre à jour la référence de l'état précédent
    prevTriggerRef.current = triggerDispersion;
  }, [triggerDispersion, onDispersionComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      effectRef.current?.cancel();
      effectRef.current = null;
    };
  }, []);

  // Ne pas cacher le logo par défaut, seulement pendant l'animation de dispersion
  const logoStyle = {
    willChange: 'transform, opacity',
    opacity: 1, // Toujours visible par défaut
  };

  return (
    <div className={`relative ${className}`}>
      <img
        ref={logoRef}
        src={imageSrc}
        alt="logo"
        className="w-full h-auto"
        style={logoStyle}
        draggable={false}
      />
    </div>
  );
};
