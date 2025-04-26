
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
      className={cn('parallax-element absolute', className)}
      data-depth={depth}
      data-x={x}
      data-y={y}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        zIndex: 5000 - Math.floor(depth * 10), // Z-index très élevé
        transform: `translateZ(${-depth * 800}px)`,
        willChange: 'transform',
        opacity: 1,
        transition: 'transform 0.1s ease-out',
        pointerEvents: 'none'
      }}
    >
      {children}
    </div>
  );
};
