
import { useRef, useEffect } from 'react';
import { Background } from './parallax/Background';
import { useParallaxEffect } from '@/hooks/useParallaxEffect';
import { parallaxElements } from './parallax/config';
import { PaintSplash } from './parallax/PaintSplash';
import { Light } from './parallax/Light';
import { useLocation } from 'react-router-dom';

export default function ParallaxScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Utiliser notre hook de parallaxe
  useParallaxEffect(containerRef);
  
  // On s'assure que le composant est monté sur toutes les pages
  useEffect(() => {
    console.log("ParallaxScene mounted");
    return () => console.log("ParallaxScene unmounted");
  }, []);

  // Effet lors des changements de route pour les éléments parallax
  useEffect(() => {
    const paintElements = document.querySelectorAll('.parallax-element');
    paintElements.forEach(el => {
      // Ajouter une classe qui déclenche une animation temporaire
      el.classList.add('route-change-transition');
      
      // Retirer la classe après l'animation
      setTimeout(() => {
        el.classList.remove('route-change-transition');
      }, 1000);
    });
  }, [location.pathname]);
  
  return (
    <>
      {/* Le fond n'est plus nécessaire car il est géré par le BackgroundVideo */}
      {/* <Background /> */}

      <div 
        ref={containerRef}
        className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-10"
        style={{ 
          perspective: '2000px',
          transformStyle: 'preserve-3d',
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
                blendMode={element.blendMode}
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
