
import React from "react";
import { createPortal } from "react-dom";

interface TorchMaskProps {
  isTorchActive: boolean;
  mousePosition: { x: number; y: number };
  uvMode: boolean;
}

export const TorchMask: React.FC<TorchMaskProps> = ({ 
  isTorchActive, 
  mousePosition, 
  uvMode 
}) => {
  if (!isTorchActive) return null;
  
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
        transition: 'all 0.05s ease-out',
        opacity: uvMode ? '0.7' : '1', // Reduce opacity in UV mode but still visible
      }}
    >
      {/* Light halo in the center */}
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
        }}
      />
    </div>,
    document.body
  );
};
