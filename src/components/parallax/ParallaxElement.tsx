
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
      className={cn('parallax-element absolute pointer-events-none', className)}
      data-depth={depth}
      data-x={x}
      data-y={y}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        zIndex: Math.floor((depth * 1000)), // Plus de précision pour le z-index
        transform: `translateZ(${-depth * 1000}px)`, // Position initiale en Z
      }}
    >
      {children}
    </div>
  );
};
