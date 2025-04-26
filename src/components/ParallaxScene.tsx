
import { useRef } from 'react';
import { PaintSplash } from './parallax/PaintSplash';
import { Pipe } from './parallax/Pipe';
import { Light } from './parallax/Light';
import { Vent } from './parallax/Vent';
import { Background } from './parallax/Background';
import { useParallaxEffect } from '@/hooks/useParallaxEffect';
import { parallaxElements } from './parallax/config';

export default function ParallaxScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useParallaxEffect(containerRef);
  
  return (
    <>
      {/* Background en position fixed, indépendant du conteneur parallax pour un effet maximal */}
      <Background imagePath="/lovable-uploads/d5371d86-1927-4507-9da6-d2ee46d0d577.png" />

      <div 
        ref={containerRef}
        className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ perspective: '10000px', transformStyle: 'preserve-3d' }}
      >
        {parallaxElements.map((element, index) => {
          if (element.type === 'background') return null;

          if (element.type === 'paint') {
            return (
              <PaintSplash
                key={`paint-${index}`}
                x={element.x!}
                y={element.y!}
                depth={element.depth}
                scale={element.scale}
                rotation={element.rotation}
                className={element.className}
                src={element.src!}
              />
            );
          }

          if (element.type === 'pipe') {
            return (
              <Pipe
                key={`pipe-${index}`}
                x={element.x!}
                y={element.y!}
                depth={element.depth}
                scale={element.scale}
                rotation={element.rotation}
                className={element.className}
              />
            );
          }

          if (element.type === 'light') {
            return (
              <Light
                key={`light-${index}`}
                x={element.x!}
                y={element.y!}
                depth={element.depth}
                size={element.size!}
                glow={element.glow!}
                className={element.className}
              />
            );
          }

          if (element.type === 'vent') {
            return (
              <Vent
                key={`vent-${index}`}
                x={element.x!}
                y={element.y!}
                depth={element.depth}
                scale={element.scale}
                className={element.className}
              />
            );
          }

          return null;
        })}
      </div>
    </>
  );
}
