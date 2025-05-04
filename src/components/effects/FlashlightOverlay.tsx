
import React, { memo, useMemo } from 'react';
import { createPortal } from "react-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface FlashlightOverlayProps {
  isTorchActive: boolean;
  uvMode: boolean;
  mousePosition: { x: number; y: number };
}

export const FlashlightOverlay: React.FC<FlashlightOverlayProps> = memo(({
  isTorchActive,
  uvMode,
  mousePosition
}) => {
  const isMobile = useIsMobile();

  // Ne rien rendre si la torche n'est pas active
  if (!isTorchActive) return null;
  
  // Utiliser useMemo pour calculer les styles basés sur la position de la souris et le mode
  const overlayStyle = useMemo(() => {
    if (uvMode) {
      // Style pour le mode UV
      return {
        background: `radial-gradient(ellipse 350px 550px at ${mousePosition.x}px ${mousePosition.y}px, 
          rgba(10,0,60,0) 0%, 
          rgba(10,0,60,0.6) 40%, 
          rgba(10,0,60,0.7) 60%,
          rgba(10,0,60,0.8) 80%,
          rgba(10,0,60,0.95) 100%)`,
        mixBlendMode: 'normal' as const,
        transition: 'none', // Supprimé la transition pour un suivi immédiat
        willChange: 'background', // Optimisation pour le rendu
        pointerEvents: 'none' as const,
        zIndex: 99
      };
    } else {
      // Style pour le mode torche normale
      return {
        background: `radial-gradient(ellipse 350px 550px at ${mousePosition.x}px ${mousePosition.y}px, 
          rgba(0,0,0,0) 0%, 
          rgba(0,0,0,0.6) 40%, 
          rgba(0,0,0,0.7) 60%,
          rgba(0,0,0,0.7) 80%,
          rgba(0,0,0,0.9) 100%)`,
        mixBlendMode: 'normal' as const,
        transition: 'none', // Supprimé la transition pour un suivi immédiat
        willChange: 'background', // Optimisation pour le rendu
        pointerEvents: 'none' as const,
        zIndex: 99
      };
    }
  }, [mousePosition.x, mousePosition.y, uvMode, isMobile]);
  
  const haloStyle = useMemo(() => {
    if (uvMode) {
      // Style de halo pour le mode UV
      return {
        width: '650px',
        height: '650px',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        background: 'radial-gradient(ellipse, rgba(210,255,63,0.2) 0%, rgba(153,0,255,0.1) 60%, transparent 100%)',
        filter: 'blur(15px)',
        mixBlendMode: 'screen' as const,
        transition: 'none', // Supprimé la transition pour un suivi immédiat
        willChange: 'left, top', // Optimisation pour le rendu
        position: 'absolute' as const,
        pointerEvents: 'none' as const
      };
    } else {
      // Style de halo pour le mode torche normale
      return {
        width: '650px',
        height: '650px',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        background: 'radial-gradient(ellipse, rgba(255,255,200,0.4) 0%, rgba(255,248,150,0.15) 60%, transparent 100%)',
        filter: 'blur(15px)',
        mixBlendMode: 'screen' as const,
        transition: 'none', // Supprimé la transition pour un suivi immédiat
        willChange: 'left, top', // Optimisation pour le rendu
        position: 'absolute' as const,
        pointerEvents: 'none' as const
      };
    }
  }, [mousePosition.x, mousePosition.y, uvMode, isMobile]);

  return createPortal(
    <div className="fixed inset-0 pointer-events-none" style={overlayStyle}>
      {/* Halo lumineux au centre */}
      <div style={haloStyle} />
    </div>,
    document.body
  );
});

FlashlightOverlay.displayName = 'FlashlightOverlay';
