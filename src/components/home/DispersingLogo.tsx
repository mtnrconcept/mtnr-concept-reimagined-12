
import { useLayoutEffect, useEffect, useRef } from "react";
import { createLogoDisperseEffect, DisperseOptions } from "@/lib/transitions/particle-effect";
import { useUVMode } from "@/components/effects/UVModeContext";

interface DispersingLogoProps {
  /** Indicateur de déclenchement externe */
  triggerDispersion?: boolean;
  /** Chemin de la route précédente */
  fromPath: string;
  /** Chemin de la route cible */
  toPath: string;
  /** Callback une fois la dispersion terminée */
  onDispersionComplete?: () => void;
  /** Classes CSS additionnelles */
  className?: string;
  /** Source de l'image du logo */
  imageSrc: string;
}

/**
 * DispersingLogo
 * Ne déclenche l'effet que lorsqu'on quitte la page d'accueil (fromPath='/' → toPath!='/')
 */
export const DispersingLogo = ({
  triggerDispersion = false,
  fromPath,
  toPath,
  onDispersionComplete,
  className = "",
  imageSrc,
}: DispersingLogoProps) => {
  const logoRef = useRef<HTMLImageElement>(null);
  const effectRef = useRef<{ cancel: () => void } | null>(null);
  const prevTriggerRef = useRef<boolean>(false);
  const isInitialMountRef = useRef<boolean>(true);
  const { uvMode } = useUVMode();

  // Gestion du déclenchement de la dispersion
  useLayoutEffect(() => {
    if (isInitialMountRef.current) {
      // Ignorer le premier rendu
      isInitialMountRef.current = false;
      prevTriggerRef.current = triggerDispersion;
      return;
    }
    // Conditions : passage false → true & quitter '/'
    if (
      triggerDispersion &&
      !prevTriggerRef.current &&
      fromPath === "/" &&
      toPath !== "/" &&
      logoRef.current
    ) {
      requestAnimationFrame(() => {
        const opts: DisperseOptions = {
          particleCount: 1500,
          dispersionStrength: 1.8,
          duration: 1800,
          colorPalette: ["#FFD700", "#222222", "#FFFFFF", "#FFD700"],
          onComplete: () => onDispersionComplete?.(),
        };
        // Annuler l'effet actuel avant de lancer le nouveau
        effectRef.current?.cancel();
        effectRef.current = createLogoDisperseEffect(
          logoRef.current!,
          opts
        );
      });
    }
    prevTriggerRef.current = triggerDispersion;
  }, [triggerDispersion, fromPath, toPath, onDispersionComplete]);

  // Cleanup à la destruction du composant
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
        style={{ 
          willChange: "transform, opacity", 
          opacity: 1,
          filter: uvMode 
            ? 'hue-rotate(120deg) brightness(1.5) saturate(1.5) contrast(1.2)' 
            : 'none',
          mixBlendMode: uvMode ? 'screen' : 'normal',
          transition: 'filter 0.5s ease-out'
        }}
        draggable={false}
      />
    </div>
  );
};
