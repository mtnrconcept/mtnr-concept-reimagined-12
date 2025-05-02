
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
  // Calculer un décalage d'ombre basé sur la profondeur
  const shadowDepth = depth < 0.3 ? 10 : Math.max(3, 15 * (1 - depth));
  const shadowBlur = depth < 0.3 ? 12 : Math.max(5, 20 * (1 - depth));
  const shadowOpacity = depth < 0.3 ? 0.6 : Math.max(0.3, 0.7 * (1 - depth));
  
  // Ensure blur value is never negative
  const blurAmount = Math.max(0, blur);
  
  return (
    <ParallaxElement depth={depth} x={x} y={y} className={`${className} z-50 shadow-receiver`}>
      <img
        src={src}
        alt="Paint splash"
        className="w-auto h-auto max-w-[350px] max-h-[350px] object-contain transition-transform duration-300"
        style={{
          transform: `rotate(${rotation}deg) scale(${scale})`,
          filter: `contrast(2.5) brightness(2.5) saturate(1.8) blur(${blurAmount}px) drop-shadow(0 ${shadowDepth}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity}))`,
          opacity: 1,
          mixBlendMode: 'screen',
          willChange: 'transform, opacity, filter',
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
