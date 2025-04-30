
import { useRef, useEffect } from 'react';
import { useParallaxEffects } from '@/hooks/useParallaxEffects';
import { Background } from './Background';
import { parallaxElements } from './config';
import { PaintSplash } from './PaintSplash';
import { Light } from './Light';
import { Pipe } from './Pipe';
import { Vent } from './Vent';

interface ParallaxContainerProps {
  children: React.ReactNode;
}

export const ParallaxContainer = ({ children }: ParallaxContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useParallaxEffects({ containerRef });
  
  // S'assurer que le défilement est activé sur le body
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    return () => {
      // Réinitialiser si nécessaire
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);
  
  return (
    <>
      {/* Fond avec vidéo en position fixe */}
      <Background />
      
      {/* Conteneur des éléments de parallax avec une plus grande hauteur */}
      <div 
        ref={containerRef}
        className="fixed inset-0 w-full h-screen overflow-visible pointer-events-none"
        style={{ 
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          zIndex: 2
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
                size={element.size || 50}
                glow={element.glow || "rgba(255,221,0,0.8)"}
                className={element.className}
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
      
      {/* Contenu de la page, à l'avant-plan avec zIndex élevé */}
      <div className="relative min-h-screen w-full z-10">
        {children}
      </div>
    </>
  );
};
