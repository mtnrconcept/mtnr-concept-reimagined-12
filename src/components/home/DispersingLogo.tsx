import { useLayoutEffect, useEffect, useRef } from "react";
import { createLogoDisperseEffect, DisperseOptions } from "@/lib/transitions/particle-effect";

interface DispersingLogoProps {
  triggerDispersion?: boolean;
  fromPath: string;
  toPath: string;
  onDispersionComplete?: () => void;
  className?: string;
  imageSrc: string;
}

/**
 * DispersingLogo
 * Ne se lance que lorsqu'on quitte la home (fromPath="/" -> toPath!="/")
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

  useLayoutEffect(() => {
    // Ignore le premier rendu
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevTriggerRef.current = triggerDispersion;
      return;
    }

    // Conditions : passage faux->vrai, et quitter "/"
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
        // Annule l'effet en cours et relance
        effectRef.current?.cancel();
        effectRef.current = createLogoDisperseEffect(logoRef.current!, opts);
      });
    }
    prevTriggerRef.current = triggerDispersion;
  }, [triggerDispersion, fromPath, toPath, onDispersionComplete]);

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
        style={{ willChange: "transform, opacity", opacity: 1 }}
        draggable={false}
      />
    </div>
  );
};
