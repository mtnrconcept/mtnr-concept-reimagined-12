
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
  return (
    <div
      className={cn('parallax-element absolute will-change-transform', className)}
      data-depth={depth}
      data-x={x}
      data-y={y}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        zIndex: Math.floor(1000 - depth * 100), // Ajustement du z-index basé sur la profondeur
        transform: `translateZ(${-depth * 1500}px) scale(${1 + depth * 0.5})`,
        transition: 'transform 0.05s ease-out',
        opacity: depth < 0.5 ? 1 : 0.85, // Éléments plus profonds légèrement plus transparents
        filter: `blur(${depth * 3}px)`, // Flou proportionnel à la profondeur
        pointerEvents: 'none'
      }}
    >
      {children}
    </div>
  );
};
