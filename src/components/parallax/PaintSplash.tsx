
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
  // Ajouter un log pour déboguer les chemins d'images
  console.log(`Loading splash image: ${src}`);
  
  return (
    <ParallaxElement depth={depth} x={x} y={y} className={`${className} z-50`}>
      <img
        src={src}
        alt="Paint splash"
        className="w-auto h-auto max-w-[350px] max-h-[350px] object-contain transition-transform duration-300"
        style={{
          transform: `rotate(${rotation}deg) scale(${scale})`,
          filter: `contrast(2.5) brightness(2.5) saturate(1.8) blur(${blur}px)`,
          opacity: 1,
          mixBlendMode: 'screen',
          willChange: 'transform, opacity',
          zIndex: 999
        }}
        onLoad={() => {
          console.log(`Image loaded successfully: ${src}`);
        }}
        onError={(e) => {
          console.error(`Failed to load image: ${src}`, e);
          const target = e.target as HTMLImageElement;
          target.style.border = '2px solid red';
          target.style.backgroundColor = 'yellow';
          target.style.width = '100px';
          target.style.height = '100px';
          target.style.opacity = '1';
          target.style.zIndex = '9999';
        }}
      />
    </ParallaxElement>
  );
};
