
import React, { useRef } from 'react';

type SupportedBlendMode = 'screen' | 'overlay' | 'soft-light';

interface PaintSplashProps {
  x: number;
  y: number;
  depth: number;
  scale?: number;
  rotation?: number;
  className?: string;
  src?: string;
  blur?: number;
  blendMode?: SupportedBlendMode;
}

export const PaintSplash: React.FC<PaintSplashProps> = ({
  x,
  y,
  depth,
  scale = 1,
  rotation = 0,
  className = "",
  src = '/lovable-uploads/paint-splatter-hi.png',
  blur = 0,
  blendMode = 'screen'
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  // Calculer le z-index basé sur la profondeur
  // Les éléments proches (depth négatif) ont un z-index plus élevé
  const zIndex = depth < 0 ? Math.floor(20 - depth * 10) : Math.floor(10 - depth * 10);
  
  // Ajuster l'opacité en fonction de la profondeur
  // Plus loin = plus transparent, plus proche = plus opaque
  const baseOpacity = className.includes('opacity-') 
    ? parseFloat(className.match(/opacity-(\d+)/)?.[1] || '30') / 100 
    : 0.3;
  
  // Appliquer un facteur d'échelle supplémentaire basé sur la profondeur
  // pour accentuer l'effet parallaxe (plus grand quand proche, plus petit quand loin)
  const depthScale = 1 + Math.abs(depth) * (depth < 0 ? 0.3 : -0.2);
  const finalScale = scale * depthScale;

  return (
    <div
      ref={elementRef}
      className={`absolute parallax-element ${className}`}
      data-depth={depth}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${finalScale}) rotate(${rotation}deg)`,
        filter: `blur(${blur + Math.abs(depth) * 2}px)`, // Plus flou en fonction de la profondeur
        mixBlendMode: blendMode,
        zIndex: zIndex,
        willChange: 'transform, opacity',
        transition: 'transform 0.05s ease-out, opacity 0.2s ease-out',
      }}
    >
      <img 
        src={src} 
        alt="paint splash effect" 
        className="w-full h-full object-contain"
        style={{ 
          maxWidth: depth < 0 ? '550px' : depth < 0.5 ? '450px' : '350px',
          opacity: Math.max(0.1, Math.min(1, baseOpacity * (1 - Math.abs(depth) * 0.3)))
        }}
      />
    </div>
  );
};
