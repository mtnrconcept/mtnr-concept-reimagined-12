
import { ParallaxElement } from './ParallaxElement';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

type MixBlendMode = 
  | 'normal' | 'multiply' | 'screen' | 'overlay' 
  | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' 
  | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' 
  | 'hue' | 'saturation' | 'color' | 'luminosity';

interface PaintSplashProps {
  x: number;
  y: number;
  depth: number;
  scale?: number;
  rotation?: number;
  className?: string;
  src: string;
  blur?: number;
  blendMode?: MixBlendMode;
}

export const PaintSplash = ({ x, y, depth, scale = 1, rotation = 0, className = '', src, blur = 0, blendMode = 'screen' }: PaintSplashProps) => {
  const splashRef = useRef<HTMLImageElement>(null);
  const location = useLocation();
  
  // Effet pour animer les splashs lors des transitions de page
  useEffect(() => {
    const splash = splashRef.current;
    if (!splash) return;
    
    // Animation à chaque changement de page
    const animateSplash = () => {
      splash.classList.add('page-transition');
      
      setTimeout(() => {
        splash.classList.remove('page-transition');
      }, 3000); // 3s correspond à la durée de l'animation
    };
    
    animateSplash();
    
    // Nettoyage
    return () => {
      if (splash) {
        splash.classList.remove('page-transition');
      }
    };
  }, [location.pathname]);
  
  // Calculer l'intensité des effets en fonction de la profondeur
  const shadowDepth = Math.abs(depth) < 0.3 ? 15 : Math.max(3, 20 * (1 - Math.abs(depth)));
  const shadowBlur = Math.abs(depth) < 0.3 ? 20 : Math.max(5, 25 * (1 - Math.abs(depth)));
  const shadowOpacity = Math.abs(depth) < 0.3 ? 0.7 : Math.max(0.3, 0.8 * (1 - Math.abs(depth)));
  
  // Calcul de contraste et luminosité en fonction de la profondeur
  // Les éléments éloignés sont plus pâles, les éléments proches plus contrastés
  const contrast = Math.max(1.2, 2.5 - Math.abs(depth) * 1.2);
  const brightness = Math.max(1.2, 2.5 - Math.abs(depth) * 1.2);
  const saturation = Math.max(1.2, 1.8 - Math.abs(depth) * 0.5);
  
  // Calcul automatique du flou basé sur la profondeur si aucun flou spécifique n'est fourni
  const blurAmount = blur ?? Math.abs(depth) > 0.6 ? Math.abs(depth) * 8 : 0;
  
  return (
    <ParallaxElement depth={depth} x={x} y={y} className={`${className} shadow-receiver transition-all duration-500`}>
      <img
        ref={splashRef}
        src={src}
        alt="Paint splash"
        className="w-auto h-auto max-w-[350px] max-h-[350px] object-contain transition-all duration-500"
        style={{
          transform: `rotate(${rotation}deg) scale(${scale})`,
          filter: `contrast(${contrast}) brightness(${brightness}) saturate(${saturation}) blur(${blurAmount}px) drop-shadow(0 ${shadowDepth}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity}))`,
          opacity: 1,
          mixBlendMode: blendMode,
          willChange: 'transform, filter, opacity',
        }}
        onLoad={() => {
          console.log(`Image loaded: ${src}`);
        }}
        onError={(e) => {
          console.error(`Error loading image: ${src}`, e);
        }}
      />
    </ParallaxElement>
  );
};
