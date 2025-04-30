
import React from 'react';

interface VideoOverlayProps {
  className?: string;
}

export const VideoOverlay: React.FC<VideoOverlayProps> = ({ className = '' }) => {
  return (
    <>
      {/* Grille simple */}
      <div 
        className={`absolute inset-0 opacity-10 ${className}`}
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.15) 1px, transparent 1px)',
          backgroundSize: '35px 35px', 
          mixBlendMode: 'overlay'
        }}
      />
    </>
  );
};
