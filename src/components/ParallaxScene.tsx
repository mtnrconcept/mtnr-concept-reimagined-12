
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
      style={{ perspective: '1500px', transformStyle: 'preserve-3d' }}
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

      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgE1xQAAAABd0Uk5TABAgMEBQYHCAj5+vv8/f7//////////ro6iZAAAAQ0lEQVQ4y2NgQAX8/PyGDIQB4w5UgKEvWEABhEEYhEEYhEEYhEEYhEEYhEEYhEEYhEEYhEEYhEEYhEEYhEEYhEGYQRgAn0EYbO4vO3MAAAAASUVORK5CYII=")',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
