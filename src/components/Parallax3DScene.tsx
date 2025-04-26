
import { useRef, useEffect, useState } from 'react';
import { Background } from './parallax/Background';
import { ParallaxElement } from './parallax/ParallaxElement';
import { use3DParallax } from '@/hooks/use3DParallax';

// Splashes jaunes pour le design
const splashImages = [
  { path: "/lovable-uploads/5dff4cb1-c478-4ac7-814d-75617b46e725.png", x: 75, y: 15, depth: 0.2 },
  { path: "/lovable-uploads/51d0caf2-88c4-425d-8751-e697fb315c42.png", x: 10, y: 20, depth: 0.3 },
  { path: "/lovable-uploads/62a9a9d9-c7b1-4cce-b401-180c42e9a514.png", x: 50, y: 30, depth: 0.15 },
  { path: "/lovable-uploads/07c10d93-651e-4ab2-a2d1-66268cbb231b.png", x: 30, y: 40, depth: 0.25 },
  { path: "/lovable-uploads/211284ce-8851-4248-8f65-0ea7e3c0c8ff.png", x: 70, y: 60, depth: 0.35 },
  { path: "/lovable-uploads/c0a483ca-deba-4667-a277-1e85c6960e36.png", x: 25, y: 80, depth: 0.2 },
  { path: "/lovable-uploads/c51ac031-c85b-42b2-8d7d-b14f16692636.png", x: 60, y: 45, depth: 0.28 }
];

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
    splashImages.forEach(img => {
      const image = new Image();
      image.src = img.path;
      image.onload = () => {
        console.log(`Image loaded: ${img.path}`);
        setImagesLoaded(prev => ({...prev, [img.path]: true}));
      };
      image.onerror = (err) => {
        console.error(`Failed to load image: ${img.path}`, err);
      };
    });
  }, []);

  console.log(`Total images loaded: ${Object.values(imagesLoaded).filter(Boolean).length}/${splashImages.length}`);

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
        imagePath="/lovable-uploads/5688334d-9fa2-4439-9453-5a5b9cde0c81.png"
        depth={0.08}
      />
      
      {/* Splash éléments */}
      {splashImages.map((splash, index) => (
        <ParallaxElement 
          key={`splash-${index}`}
          depth={splash.depth}
          x={splash.x}
          y={splash.y}
          className="w-80 h-80 origin-center"
        >
          <div 
            className="w-full h-full bg-contain bg-center bg-no-repeat transform"
            style={{
              backgroundImage: `url(${splash.path})`,
              filter: 'brightness(1.2) contrast(1.1) hue-rotate(-10deg)',
              mixBlendMode: 'screen',
              opacity: 0.85,
              transform: `rotate(${(index * 45) % 360}deg) scale(${1 + (index % 3) * 0.2})`
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
