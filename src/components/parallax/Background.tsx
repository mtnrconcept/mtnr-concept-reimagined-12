
import React from 'react';

interface BackgroundProps {
  imagePath?: string;
  depth?: number;
}

export const Background = ({ 
  imagePath = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png", 
  depth = 0.02 
}: BackgroundProps) => {
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
        perspective: '2000px',
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
          transform: `translateZ(${-depth * 500}px) scale(${1 + depth})`,
          opacity: 0.85,
          willChange: 'transform',
          filter: 'brightness(0.85) contrast(1.1)',
          transition: 'transform 0.2s ease-out'
        }}
      />
      
      {/* Overlay pour renforcer la séparation */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
      
      {/* Effet grille pour la profondeur */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: 'translateZ(-100px)'
        }}
      />
    </div>
  );
};
