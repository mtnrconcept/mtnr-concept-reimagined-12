
import React from 'react';

interface VideoOverlayProps {
  className?: string;
}

export const VideoOverlay: React.FC<VideoOverlayProps> = ({ className = '' }) => {
  return (
    <>
      {/* Grille subtile avec une très faible opacité */}
      <div 
        className={`absolute inset-0 pointer-events-none ${className}`}
        style={{
          opacity: 0.05,
          backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.12) 1px, transparent 1px)',
          backgroundSize: '35px 35px', 
          mixBlendMode: 'overlay',
        }}
      />
      
      {/* Vignette sombre sur les bords pour un effet de profondeur */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.5) 100%)',
          mixBlendMode: 'multiply',
        }}
      />
    </>
  );
};
