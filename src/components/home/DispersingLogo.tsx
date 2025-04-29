import { useLayoutEffect, useEffect, useRef } from 'react';
import { createLogoDisperseEffect, DisperseOptions } from '@/lib/transitions/particle-effect';

interface DispersingLogoProps {
  triggerDispersion?: boolean;
  /** Chemin de la route précédente */
  fromPath: string;
  /** Chemin de la route cible */
  toPath: string;
  onDispersionComplete?: () => void;
  className?: string;
  imageSrc: string;
}

/**
 * Logo dispersing component.
 * Ne déclenche l’effet que si l’on quitte la page d’accueil (fromPath='/' → toPath!='/')
 */
export const DispersingLogo = ({
  triggerDispersion = false,
  fromPath,
  toPath,
  onDispersionComplete,
  className = '',
  imageSrc,
}: DispersingLogoProps) => {
  const logoRef = useRef<HTMLImageElement>(null);
  const effectRef = useRef<{ cancel: () => void } | null>(null);
  const prevTriggerRef = useRef<boolean>(false);
  const isInitialMountRef = useRef<boolean>(true);

  useLayoutEffect(() => {
    // Ignorer le premier rendu
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevTriggerRef.current = triggerDispersion;
      return;
    }

    // Ne trigger qu'en quittant '/' vers une autre route
    if (
      triggerDispersion &&
      !prevTriggerRef.current &&
      fromPath === '/' &&
      toPath !== '/' &&
      logoRef.current
    ) {
      requestAnimationFrame(() => {
        const opts: DisperseOptions = {
          particleCount: 1500,
          dispersionStrength: 1.8,
          duration: 1800,
          colorPalette: ['#FFD700', '#222222', '#FFFFFF', '#FFD700'],
          onComplete: () => onDispersionComplete?.(),
        };

        // Annuler tout effet en cours
        effectRef.current?.cancel();
        effectRef.current = createLogoDisperseEffect(logoRef.current, opts);
      });
    }
    // Mettre à jour l'état précédent
    prevTriggerRef.current = triggerDispersion;
  }, [triggerDispersion, fromPath, toPath, onDispersionComplete]);

  // Cleanup à la destruction
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
        style={{ willChange: 'transform, opacity', opacity: 1 }}
        draggable={false}
      />
    </div>
  );
};