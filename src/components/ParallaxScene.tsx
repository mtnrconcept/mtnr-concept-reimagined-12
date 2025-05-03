
import { useRef, useEffect } from 'react';
import { Background } from './parallax/Background';
import { useParallaxEffect } from '@/hooks/useParallaxEffect';
import { parallaxElements } from './parallax/config';
import { PaintSplash } from './parallax/PaintSplash';
import { Light } from './parallax/Light';

export default function ParallaxScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Utiliser notre hook de parallaxe
  useParallaxEffect(containerRef);
  
  // On s'assure que le composant est monté sur toutes les pages
  useEffect(() => {
    console.log("ParallaxScene mounted");
    return () => console.log("ParallaxScene unmounted");
  }, []);
  
  return (
    <>
      {/* Le fond n'est plus nécessaire car il est géré par le BackgroundVideo */}
      {/* <Background /> */}

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
          
          return null;
        })}
      </div>
    </>
  );
}
