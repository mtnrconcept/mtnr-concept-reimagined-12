
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
  // Calculer l'intensité des effets en fonction de la profondeur
  const shadowDepth = Math.abs(depth) < 0.3 ? 15 : Math.max(3, 20 * (1 - depth));
  const shadowBlur = Math.abs(depth) < 0.3 ? 20 : Math.max(5, 25 * (1 - depth));
  const shadowOpacity = Math.abs(depth) < 0.3 ? 0.7 : Math.max(0.3, 0.8 * (1 - depth));
  
  // Calcul de contraste et luminosité en fonction de la profondeur
  // Les éléments éloignés sont plus pâles, les éléments proches plus contrastés
  const contrast = Math.max(1.2, 2.5 - Math.abs(depth) * 1.2);
  const brightness = Math.max(1.2, 2.5 - Math.abs(depth) * 1.2);
  const saturation = Math.max(1.2, 1.8 - Math.abs(depth) * 0.5);
  
  // Ensure blur value is never negative
  const blurAmount = Math.max(0, blur);
  
  return (
    <ParallaxElement depth={depth} x={x} y={y} className={`${className} shadow-receiver`}>
      <img
        src={src}
        alt="Paint splash"
        className="w-auto h-auto max-w-[350px] max-h-[350px] object-contain"
        style={{
          transform: `rotate(${rotation}deg) scale(${scale})`,
          filter: `contrast(${contrast}) brightness(${brightness}) saturate(${saturation}) blur(${blurAmount}px) drop-shadow(0 ${shadowDepth}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity}))`,
          opacity: 1,
          mixBlendMode: 'screen',
          willChange: 'transform, filter',
        }}
        onLoad={() => {
          console.log(`Image loaded: ${src}`);
        }}
        onError={(e) => {
          console.error(`Error loading image: ${src}`, e);
          const target = e.target as HTMLImageElement;
          target.style.border = '2px solid red';
          target.style.backgroundColor = 'yellow';
          target.style.width = '100px';
          target.style.height = '100px';
        }}
      />
    </ParallaxElement>
  );
};
