
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
  // Calcul du z-index basé sur la profondeur pour un meilleur ordonnancement visuel
  const zIndex = Math.floor(1000 - depth * 1000);
  
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
        // Position initiale avec effet de profondeur renforcé
        transform: `translateZ(${-depth * 2500}px) scale(${1 + depth * 0.8})`,
        transition: 'transform 0.02s ease-out', // Transition plus rapide
        opacity: depth < 0.3 ? 1 : 0.9, // Éléments plus profonds légèrement plus transparents
        filter: `blur(${depth * 5}px)`, // Flou proportionnel à la profondeur accentué
        pointerEvents: 'none',
        transformOrigin: 'center center',
      }}
    >
      {children}
    </div>
  );
};
