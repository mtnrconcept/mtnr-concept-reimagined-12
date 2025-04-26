
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
  
  // Ajouter des logs pour déboguer
  console.log('Rendering ParallaxScene with', parallaxElements.length, 'elements');
  
  return (
    <>
      {/* Background avec l'image d'escalier */}
      <Background imagePath="/lovable-uploads/5688334d-9fa2-4439-9453-5a5b9cde0c81.png" />

      <div 
        ref={containerRef}
        className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ 
          perspective: '2000px',
          transformStyle: 'preserve-3d',
          zIndex: 10,
        }}
      >
        {/* Debug marker */}
        <div className="fixed top-10 left-10 w-20 h-20 bg-yellow-500 opacity-50 z-[100]" />

        {parallaxElements.map((element, index) => {
          if (element.type === 'background') return null;

          if (element.type === 'paint') {
            console.log(`Rendering paint splash at (${element.x}, ${element.y}) with src: ${element.src}`);
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
                blur={element.blur}
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
              />
            );
          }

          if (element.type === 'light' && element.size !== undefined && element.glow !== undefined) {
            return (
              <Light
                key={`light-${index}`}
                x={element.x!}
                y={element.y!}
                depth={element.depth}
                size={element.size}
                glow={element.glow}
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
              />
            );
          }

          return null;
        })}
      </div>
    </>
  );
}
