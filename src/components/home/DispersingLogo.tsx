
import { useLayoutEffect, useRef } from "react";

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
  onDispersionComplete,
  className = "",
  imageSrc,
}: DispersingLogoProps) => {
  const logoRef = useRef<HTMLImageElement>(null);
  const isInitialMountRef = useRef<boolean>(true);

  // Appeler directement le callback si fourni
  useLayoutEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    
    // Appeler le callback de fin si fourni
    if (onDispersionComplete) {
      setTimeout(onDispersionComplete, 100);
    }
  }, [onDispersionComplete]);

  return (
    <div className={`relative ${className}`}>      
      <img
        ref={logoRef}
        src={imageSrc}
        alt="logo"
        className="w-full h-auto"
        style={{ willChange: "transform, opacity", opacity: 1 }}
        draggable={false}
      />
    </div>
  );
};
