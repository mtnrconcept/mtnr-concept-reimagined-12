
import React from 'react';
import BackgroundVideo from '../effects/BackgroundVideo';

interface BackgroundProps {
  imagePath?: string;
  useVideo?: boolean;
  depth?: number;
}

export const Background = ({ 
  imagePath = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png", 
  useVideo = true,
  depth = 0.08 
}: BackgroundProps) => {
  // Si useVideo est true, on utilise le composant BackgroundVideo
  if (useVideo) {
    return <BackgroundVideo fallbackImage={imagePath} />;
  }
  
  // Sinon, on utilise l'image de fond classique
  return (
    <div 
      className="fixed inset-0 w-full h-full"
      style={{
        zIndex: 0,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        perspective: '1200px',
        transformStyle: 'preserve-3d'
      }}
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transform-3d"
        data-depth={depth}
        style={{
          backgroundImage: `url("${imagePath}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `translateZ(${-depth * 800}px) scale(${1 + depth * 1.5})`, 
          opacity: 1, 
          willChange: 'transform',
          filter: 'brightness(1) contrast(1.2)',
          transition: 'transform 0.1s ease-out'
        }}
      />
      
      {/* Reste du code conservé */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
      
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
  );
};
