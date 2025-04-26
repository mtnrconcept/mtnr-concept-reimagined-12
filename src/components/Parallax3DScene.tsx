
import { useRef, useEffect, useState } from 'react';
import { Background } from './parallax/Background';
import { ParallaxElement } from './parallax/ParallaxElement';
import { use3DParallax } from '@/hooks/use3DParallax';
import { parallaxElements } from './parallax/config';

export default function Parallax3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  
  use3DParallax(containerRef, {
    strength: 20,
    perspective: 1200,
    easing: 0.08
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
        perspective: '1200px',
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
        .map((splash, index) => (
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
                filter: `contrast(2) brightness(2) saturate(1.5) blur(${splash.blur || 0}px)`,
                mixBlendMode: 'screen',
                willChange: 'transform, opacity'
              }}
            />
          </ParallaxElement>
        ))}
      
      {/* Neon grid effect */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div 
          className="w-full h-full opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffdd00 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)'
          }}
        />
      </div>
    </div>
  );
}
