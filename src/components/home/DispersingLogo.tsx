
import { useLayoutEffect, useEffect, useRef } from "react";
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
 * Version modifiée qui n'utilise plus l'effet de dispersion
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
  const isInitialMountRef = useRef<boolean>(true);
  const { uvMode } = useUVMode();

  // Gestion du déclenchement de la transition sans dispersion
  useLayoutEffect(() => {
    if (isInitialMountRef.current) {
      // Ignorer le premier rendu
      isInitialMountRef.current = false;
      return;
    }
    
    // Appeler directement le callback si nécessaire
    if (triggerDispersion && fromPath === "/" && toPath !== "/") {
      // Exécution immédiate du callback sans attendre d'animation
      if (onDispersionComplete) {
        setTimeout(onDispersionComplete, 100);
      }
    }
  }, [triggerDispersion, fromPath, toPath, onDispersionComplete]);

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
