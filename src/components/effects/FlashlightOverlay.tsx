
import React, { useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FlashlightOverlayProps {
  isTorchActive: boolean;
  uvMode: boolean;
  mousePosition: { x: number; y: number };
}

export const FlashlightOverlay: React.FC<FlashlightOverlayProps> = ({ 
  isTorchActive, 
  uvMode,
  mousePosition
}) => {
  // Store references to the overlay and mask elements
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const maskRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  
  // Effect to update flashlight position
  useEffect(() => {
    // Skip effect if not needed
    if (!isTorchActive || !overlayRef.current || !maskRef.current) return;
    
    // Don't show flashlight effect in UV mode
    if (uvMode) return;
  
    // Update mask position based on mouse coordinates
    const maskSize = isMobile ? 200 : 300; // Smaller mask on mobile
    
    maskRef.current.style.left = `${mousePosition.x}px`;
    maskRef.current.style.top = `${mousePosition.y}px`;
    maskRef.current.style.width = `${maskSize}px`;
    maskRef.current.style.height = `${maskSize}px`;
    
    // Make sure the overlay is visible
    overlayRef.current.style.opacity = "1";
    
  }, [isTorchActive, mousePosition.x, mousePosition.y, uvMode, isMobile]);
  
  // Ne pas retourner null prématurément pour éviter les erreurs de hooks
  // Calculer le contenu à rendre en fonction des conditions
  let content = null;
  
  // Rendre le contenu de la torche seulement si les conditions sont remplies
  if (isTorchActive && !uvMode) {
    content = (
      <div 
        ref={overlayRef}
        className="flashlight-overlay fixed inset-0 pointer-events-none z-40"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          mixBlendMode: 'normal'
        }}
      >
        <div 
          ref={maskRef}
          className="flashlight-mask"
          style={{
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            boxShadow: '0 0 0 2000px rgba(0, 0, 0, 1)',
            backgroundColor: 'transparent',
            mixBlendMode: 'overlay',
          }}
        ></div>
      </div>
    );
  }
  
  return content;
};
