
import React from 'react';

interface VideoOverlayProps {
  className?: string;
}

export const VideoOverlay: React.FC<VideoOverlayProps> = ({ className = '' }) => {
  return (
    <>
      {/* Grille subtile avec une très faible opacité */}
      <div 
        className={`absolute inset-0 opacity-5 ${className}`}
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.12) 1px, transparent 1px)',
          backgroundSize: '35px 35px', 
          mixBlendMode: 'overlay',
          pointerEvents: 'none' // Pour s'assurer que l'overlay n'intercepte pas les clics
        }}
      />
    </>
  );
};
