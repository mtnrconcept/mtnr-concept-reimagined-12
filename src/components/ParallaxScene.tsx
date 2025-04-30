
import { useRef } from 'react';
import { Background } from './parallax/Background';
import { useParallaxEffect } from '@/hooks/useParallaxEffect';
import { parallaxElements } from './parallax/config';
import { PaintSplash } from './parallax/PaintSplash';

export default function ParallaxScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useParallaxEffect(containerRef);
  
  return (
    <>
      {/* Background avec vidéo */}
      <Background />

      <div 
        ref={containerRef}
        className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ 
          perspective: '2000px',
          transformStyle: 'preserve-3d',
          zIndex: 10,
        }}
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
                blur={element.blur}
              />
            );
          }
          
          return null;
        })}
      </div>
    </>
  );
}
