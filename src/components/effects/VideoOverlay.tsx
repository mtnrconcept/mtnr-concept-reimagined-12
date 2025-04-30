
import React from 'react';

interface VideoOverlayProps {
  className?: string;
}

export const VideoOverlay: React.FC<VideoOverlayProps> = ({ className = '' }) => {
  return (
    <>
      {/* Grille avec performance optimisée */}
      <div 
        className={`absolute inset-0 opacity-10 ${className}`}
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.15) 1px, transparent 1px)',
          backgroundSize: '35px 35px', 
          transform: 'translateZ(-50px)',
          mixBlendMode: 'overlay',
          willChange: 'transform'
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none'
        }}
      />
    </>
  );
};
