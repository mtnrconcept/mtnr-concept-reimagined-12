
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
  // Calcul du z-index basé sur la profondeur pour placer correctement les éléments
  const zIndex = depth < 0 ? Math.floor(2000 - depth * 1000) : Math.floor(1000 - depth * 1000);
  
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
        // Position avec effet de profondeur amplifié
        transform: `translateZ(${-depth * 3500}px) scale(${1 + depth * 1.2})`,
        transition: 'transform 0.02s ease-out',
        opacity: depth < 0 ? 0.8 : depth < 0.3 ? 1 : 0.9,
        filter: `blur(${Math.max(0, depth * 8)}px)`,
        pointerEvents: 'none',
        transformOrigin: 'center center',
      }}
    >
      {children}
    </div>
  );
};
