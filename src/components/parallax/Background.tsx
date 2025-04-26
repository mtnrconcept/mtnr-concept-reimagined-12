
import React from 'react';

interface BackgroundProps {
  imagePath?: string;
  depth?: number;
}

export const Background = ({ 
  imagePath = "/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png", 
  depth = 0.1 
}: BackgroundProps) => {
  console.log("Rendering background with image:", imagePath);
  
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
        perspective: '1000px',
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
          transform: `translateZ(${-depth * 1000}px) scale(${1 + depth * 1.5})`,
          opacity: 0.8,
          willChange: 'transform',
          filter: 'brightness(0.85) contrast(1.1)',
          transition: 'transform 0.1s ease-out'
        }}
      />
      
      {/* Overlay pour ajouter de la profondeur */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
      
      {/* Effet grille pour renforcer la profondeur */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: 'translateZ(-50px)'
        }}
      />
    </div>
  );
};

