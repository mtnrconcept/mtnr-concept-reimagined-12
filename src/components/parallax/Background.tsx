
import React from 'react';

interface BackgroundProps {
  useVideo?: boolean;
  depth?: number;
}

export const Background = ({ 
  useVideo = true,
  depth = 0.08 
}: BackgroundProps) => {
  // Ne plus utiliser la vidéo ici, car elle est maintenant gérée au niveau de l'App
  // Utiliser uniquement un fond noir simple avec la grille et l'effet de vignette
  return (
    <div 
      className="fixed inset-0 w-full h-full bg-black"
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
      {/* Grille */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.15) 1px, transparent 1px)',
          backgroundSize: '35px 35px', 
          transform: 'translateZ(-50px)',
          mixBlendMode: 'overlay'
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
    </div>
  );
};
