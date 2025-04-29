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

  // Trigger dispersion immediately after layout flush
  useLayoutEffect(() => {
    if (!triggerDispersion || !logoRef.current) return;

    // Use next animation frame to avoid blocking paint
    requestAnimationFrame(() => {
      const opts: DisperseOptions = {
        particleCount: 600,
        dispersionStrength: 2.0,
        duration: 1200,
        colorPalette: ['#FFD700', '#222222', '#FFFFFF'],
        onComplete: () => {
          onDispersionComplete?.();
        },
      };

      // Cancel any existing effect
      effectRef.current?.cancel();
      effectRef.current = createLogoDisperseEffect(logoRef.current!, opts);
    });
  }, [triggerDispersion, onDispersionComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      effectRef.current?.cancel();
      effectRef.current = null;
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <img
        ref={logoRef}
        src={imageSrc}
        alt="logo"
        className="w-full h-auto"
        style={{ willChange: 'transform, opacity' }}
        draggable={false}
      />
    </div>
  );
};
