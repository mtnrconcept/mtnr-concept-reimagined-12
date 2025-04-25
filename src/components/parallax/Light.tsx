
import { ParallaxElement } from './ParallaxElement';

interface LightProps {
  x: number;
  y: number;
  depth: number;
  size: number;
  glow: string;
  className?: string;
}

export const Light = ({ x, y, depth, size, glow, className = '' }: LightProps) => {
  return (
    <ParallaxElement depth={depth} x={x} y={y} className={className}>
      <div 
        className="rounded-full mix-blend-screen animate-pulse"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle, ${glow}, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />
    </ParallaxElement>
  );
};
