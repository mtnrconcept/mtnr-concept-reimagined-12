
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
  return (
    <ParallaxElement depth={depth} x={x} y={y} className={`${className}`}>
      <img
        src={src}
        alt="Paint splash"
        className="w-auto h-auto max-w-[350px] max-h-[350px] object-contain transition-transform duration-300"
        style={{
          transform: `rotate(${rotation}deg) scale(${scale})`,
          filter: `contrast(2) brightness(2) saturate(1.5) blur(${blur}px)`,
          opacity: 1,
          mixBlendMode: 'screen', // Utilisation du mode screen qui fonctionne bien sur fond noir
          willChange: 'transform, opacity',
          zIndex: 9999 // Z-index très élevé
        }}
        onLoad={() => {
          console.log(`Image loaded successfully: ${src}`);
        }}
        onError={(e) => {
          console.error(`Failed to load image: ${src}`, e);
          (e.target as HTMLImageElement).style.border = '2px solid red';
          (e.target as HTMLImageElement).style.backgroundColor = 'yellow';
          (e.target as HTMLImageElement).style.width = '100px';
          (e.target as HTMLImageElement).style.height = '100px';
        }}
      />
    </ParallaxElement>
  );
};
