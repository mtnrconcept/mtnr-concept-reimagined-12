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
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ perspective: '2500px', transformStyle: 'preserve-3d' }}
    >
      <Background />

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
  );
}
