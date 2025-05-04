
import React from 'react';
import { createPortal } from "react-dom";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  if (!isTorchActive || uvMode) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[99] pointer-events-none"
      style={{
        background: `radial-gradient(ellipse 350px 550px at ${mousePosition.x}px ${mousePosition.y}px, 
          rgba(0,0,0,0) 0%, 
          rgba(0,0,0,0.6) 40%, 
          rgba(0,0,0,0.7) 60%,
          rgba(0,0,0,0.7) 80%,
          rgba(0,0,0,0.9) 100%)`,
        mixBlendMode: 'normal',
        transition: isMobile ? 'none' : 'all 0.05s ease-out',
      }}
    >
      {/* Halo lumineux au centre */}
      <div 
        className="absolute pointer-events-none"
        style={{
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          background: 'radial-gradient(ellipse, rgba(255,255,200,0.4) 0%, rgba(255,248,150,0.15) 60%, transparent 100%)',
          filter: 'blur(15px)',
          mixBlendMode: 'screen',
          transition: isMobile ? 'none' : 'all 0.05s ease-out',
        }}
      />
    </div>,
    document.body
  );
};
