
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
        zIndex: Math.floor(100 - depth * 10), // Augmenté à 100 pour être sûr d'être au-dessus du fond
        transform: `translateZ(${-depth * 800}px)`,
        willChange: 'transform',
        opacity: 1,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  );
};
