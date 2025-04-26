
import React from 'react';

interface BackgroundProps {
  imagePath?: string;
  depth?: number;
}

export const Background = ({ 
  imagePath = "/lovable-uploads/d5371d86-1927-4507-9da6-d2ee46d0d577.png", 
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
          opacity: 0.5, // Ajustement de l'opacité pour mieux voir l'image
          willChange: 'transform',
          filter: 'brightness(0.7) contrast(1.2)', // Amélioration du contraste
          transition: 'transform 0.1s ease-out'
        }}
      />
      
      {/* Overlay pour ajouter de la profondeur */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
      
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
