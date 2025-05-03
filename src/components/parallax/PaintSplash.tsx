
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

  return (
    <div
      ref={elementRef}
      className={`absolute parallax-element ${className}`}
      data-depth={depth}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        filter: `blur(${blur}px)`,
        mixBlendMode: blendMode,
        zIndex: depth < 0 ? 2 : 0,
        willChange: 'transform, opacity',
      }}
    >
      <img 
        src={src} 
        alt="paint splash effect" 
        className="w-full h-full object-contain"
        style={{ maxWidth: '500px' }}
      />
    </div>
  );
};
