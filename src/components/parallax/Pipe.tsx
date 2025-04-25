
import { ParallaxElement } from './ParallaxElement';

interface PipeProps {
  x: number;
  y: number;
  depth: number;
  scale?: number;
  rotation?: number;
  className?: string;
}

export const Pipe = ({ x, y, depth, scale = 1, rotation = 0, className = '' }: PipeProps) => {
  return (
    <ParallaxElement depth={depth} x={x} y={y} className={className}>
      <div 
        className="bg-zinc-800 rounded-full shadow-2xl"
        style={{
          width: '60px',
          height: '12px',
          transform: `rotate(${rotation}deg) scale(${scale})`,
          boxShadow: '0 0 15px rgba(0,0,0,0.5)',
        }}
      />
    </ParallaxElement>
  );
};
