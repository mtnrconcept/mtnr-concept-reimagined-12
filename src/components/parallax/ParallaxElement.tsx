
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
        transform: `translateZ(${-depth * 3500}px) scale(${1 + depth * 1.2})`,
        transition: 'transform 0.02s ease-out',
        opacity: depth < 0 ? 0.4 : depth < 0.3 ? 0.6 : 0.5, // Opacités réduites
        filter: `blur(${Math.max(0, depth * 8)}px)`,
        pointerEvents: 'none',
        transformOrigin: 'center center',
      }}
    >
      {children}
    </div>
  );
};
