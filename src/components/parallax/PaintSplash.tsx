
import { ParallaxElement } from './ParallaxElement';

interface PaintSplashProps {
  x: number;
  y: number;
  depth: number;
  scale?: number;
  rotation?: number;
  className?: string;
  src: string;
}

export const PaintSplash = ({ x, y, depth, scale = 1, rotation = 0, className = '', src }: PaintSplashProps) => {
  return (
    <ParallaxElement depth={depth} x={x} y={y} className={className}>
      <img
        src={src}
        alt=""
        className="w-auto h-auto max-w-[350px] max-h-[350px] object-contain"
        style={{
          transform: `rotate(${rotation}deg) scale(${scale})`,
          filter: 'contrast(1.2) brightness(1.1) drop-shadow(0 0 10px rgba(255, 215, 0, 0.2))',
          opacity: 0.9,
          mixBlendMode: 'lighten'
        }}
      />
    </ParallaxElement>
  );
}
