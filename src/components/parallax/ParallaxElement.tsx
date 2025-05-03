
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ParallaxElementProps {
  depth: number;
  x: number;
  y: number;
  className?: string;
  children: ReactNode;
}

export const ParallaxElement = ({ depth, x, y, className, children }: ParallaxElementProps) => {
  // Pour les éléments au premier plan (depth négative), on utilise un z-index très élevé
  const zIndex = depth < 0 ? Math.floor(9000 - depth * 1000) : Math.floor(1000 - depth * 1000);
  
  // Calcul du flou en fonction de la profondeur (plus flou en arrière-plan)
  const blurAmount = Math.max(0, depth < 0 ? 0 : depth * 4);
  
  // Calcul de l'opacité en fonction de la profondeur
  const opacity = depth < 0 
    ? Math.max(0.3, 0.8 - Math.abs(depth) * 0.2) // Éléments au premier plan
    : Math.max(0.25, 1 - depth * 0.6); // Éléments en arrière-plan
  
  return (
    <div
      className={cn('parallax-element absolute will-change-transform', className)}
      data-depth={depth}
      data-x={x}
      data-y={y}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        zIndex,
        transform: `translateZ(${depth * -2000}px) scale(${1 + Math.abs(depth) * 0.5})`,
        opacity,
        filter: `blur(${blurAmount}px)`,
        pointerEvents: 'none',
        transformOrigin: 'center center',
        transition: 'transform 0.01s linear',
      }}
    >
      {children}
    </div>
  );
};
