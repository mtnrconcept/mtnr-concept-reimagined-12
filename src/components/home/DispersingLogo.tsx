
import { useLayoutEffect, useEffect, useRef } from 'react';
import { createLogoDisperseEffect, DisperseOptions } from '@/lib/transitions/particle-effect';

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

  // Trigger dispersion immediately after layout flush, but only when going from false to true
  useLayoutEffect(() => {
    // Ne déclencher que si triggerDispersion passe de false à true
    if (triggerDispersion && !prevTriggerRef.current && logoRef.current) {
      // Use next animation frame to avoid blocking paint
      requestAnimationFrame(() => {
        const opts: DisperseOptions = {
          particleCount: 1200,
          dispersionStrength: 2.0,
          duration: 2000,
          colorPalette: ['#FFD700', '#222222', '#FFFFFF'],
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
