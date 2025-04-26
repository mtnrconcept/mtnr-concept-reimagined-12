
import { ParallaxElement } from './ParallaxElement';

interface PaintSplashProps {
  x: number;
  y: number;
  depth: number;
  scale?: number;
  rotation?: number;
  className?: string;
  src: string;
  blur?: number;
}

export const PaintSplash = ({ x, y, depth, scale = 1, rotation = 0, className = '', src, blur = 0 }: PaintSplashProps) => {
  // Calcul de l'opacité basé sur la profondeur
  const opacity = Math.max(0.7, 1 - Math.abs(depth - 0.4) * 1);
  
  return (
    <ParallaxElement depth={depth} x={x} y={y} className={className}>
      <img
        src={src}
        alt=""
        className="w-auto h-auto max-w-[350px] max-h-[350px] object-contain transition-transform duration-300"
        style={{
          transform: `rotate(${rotation}deg) scale(${scale})`,
          filter: `contrast(1.1) brightness(1.1) blur(${blur}px)`,
          opacity,
          mixBlendMode: 'normal',
          willChange: 'transform, opacity'
        }}
      />
    </ParallaxElement>
  );
};
