
import { ParallaxElement } from './ParallaxElement';

interface VentProps {
  x: number;
  y: number;
  depth: number;
  scale?: number;
  className?: string;
}

export const Vent = ({ x, y, depth, scale = 1, className = '' }: VentProps) => {
  return (
    <ParallaxElement depth={depth} x={x} y={y} className={className}>
      <div 
        className="bg-zinc-900/80 border border-zinc-800"
        style={{
          width: '40px',
          height: '30px',
          transform: `scale(${scale})`,
        }}
      >
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-zinc-700 w-full h-[2px]"
            style={{ top: `${(i + 1) * 25}%` }}
          />
        ))}
      </div>
    </ParallaxElement>
  );
};
