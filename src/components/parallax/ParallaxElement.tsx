
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
        zIndex: Math.floor(10 - depth * 10), // Inversion pour que les éléments avec une faible profondeur soient au-dessus
        transform: `translateZ(${-depth * 1000}px)`,
        willChange: 'transform',
        opacity: 1
      }}
    >
      {children}
    </div>
  );
};
