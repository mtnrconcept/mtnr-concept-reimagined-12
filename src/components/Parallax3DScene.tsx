
import { useRef, useEffect, useState } from 'react';
import { Background } from './parallax/Background';
import { ParallaxElement } from './parallax/ParallaxElement';
import { use3DParallax } from '@/hooks/use3DParallax';
import { parallaxElements } from './parallax/config';
import { safeBlur } from '@/lib/animation-utils';

export default function Parallax3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  
  use3DParallax(containerRef, {
    strength: 40, // Augmenté pour plus d'amplitude
    perspective: 800, // Perspective plus courte pour un effet plus dramatique
    easing: 0.05 // Plus fluide
  });
  
  useEffect(() => {
    // Préchargement des images
    parallaxElements
      .filter(el => el.type === 'paint' && el.src)
      .forEach(img => {
        const image = new Image();
        image.src = img.src!;
        image.onload = () => {
          console.log(`Image loaded: ${img.src}`);
          setImagesLoaded(prev => ({...prev, [img.src!]: true}));
        };
        image.onerror = (err) => {
          console.error(`Failed to load image: ${img.src}`, err);
        };
      });
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ 
        perspective: '800px', // Perspective plus courte pour effet plus marqué
        transformStyle: 'preserve-3d',
        zIndex: 0
      }}
    >
      {/* Fond avec effet parallax */}
      <Background 
        imagePath="/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png"
        depth={0.08}
      />
      
      {/* Splash éléments from config */}
      {parallaxElements
        .filter(el => el.type === 'paint')
        .map((splash, index) => {
          // Ensure blur value is non-negative
          const blurAmount = Math.max(0, splash.blur || 0);
          
          return (
            <ParallaxElement 
              key={`splash-${index}`}
              depth={splash.depth}
              x={splash.x || 0}
              y={splash.y || 0}
              className="origin-center"
            >
              <img
                src={splash.src}
                alt="Paint effect"
                className={`max-w-[350px] max-h-[350px] object-contain ${splash.className || ''}`}
                style={{
                  transform: `rotate(${splash.rotation || 0}deg) scale(${splash.scale || 1})`,
                  filter: `contrast(2.2) brightness(2.2) saturate(1.8) blur(${blurAmount}px)`,
                  mixBlendMode: 'screen',
                  willChange: 'transform, opacity'
                }}
              />
            </ParallaxElement>
          );
        })}
      
      {/* Neon grid effect */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div 
          className="w-full h-full opacity-10" // Opacité augmentée
          style={{
            backgroundImage: 'radial-gradient(circle, #ffdd00 1px, transparent 1px)',
            backgroundSize: '20px 20px', // Grille plus dense
            maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
          }}
        />
      </div>
      
      {/* Ajout d'un léger effet de brouillard pour accentuer la profondeur */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.2) 50%, transparent)',
          opacity: 0.7,
          mixBlendMode: 'multiply'
        }}
      />
    </div>
  );
}
