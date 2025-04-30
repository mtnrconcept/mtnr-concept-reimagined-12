
import React from 'react';
import BackgroundVideo from '../effects/BackgroundVideo';

interface BackgroundProps {
  depth?: number;
}

export const Background = ({ depth = 0.08 }: BackgroundProps) => {
  return (
    <>
      {/* Vidéo de fond */}
      <BackgroundVideo videoSrc="/lovable-uploads/ascensceur.mp4" />
      
      {/* Couche pour les effets de grille et d'overlay */}
      <div 
        className="fixed inset-0 w-full h-full z-[1]"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d'
        }}
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.15) 1px, transparent 1px)',
            backgroundSize: '35px 35px', 
            transform: 'translateZ(-50px)',
            mixBlendMode: 'overlay'
          }}
        />
        
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
            pointerEvents: 'none'
          }}
        />
      </div>
    </>
  );
};
