
import { useRef, useEffect } from 'react';
import { ParallaxContainer } from './parallax/ParallaxContainer';
import { PaintSplash } from './parallax/PaintSplash';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const paintSplashes = [
    { src: '/lovable-uploads/paint-splatter-hi.png', x: 80, y: 15, depth: 0.3, scale: 2.2, rotation: -15 },
    { src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', x: 10, y: 25, depth: 0.4, scale: 1.8, rotation: 20 },
    { src: '/lovable-uploads/yellow-watercolor-splatter-3.png', x: 70, y: 60, depth: 0.1, scale: 1.5, rotation: 5 },
    { src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', x: 20, y: 70, depth: 0.2, scale: 1.3, rotation: -10 },
    // Éclaboussures au premier plan (avec depth négative pour être devant le contenu)
    { src: '/lovable-uploads/yellow-watercolor-splatter-3.png', x: 85, y: 30, depth: -0.3, scale: 0.9, rotation: 15, opacity: 0.5 },
    { src: '/lovable-uploads/paint-splatter-hi.png', x: 15, y: 85, depth: -0.4, scale: 0.8, rotation: -5, opacity: 0.4 }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      
      const scrollY = window.scrollY;
      
      // Effet parallax sur le fond (plus lent que le contenu)
      const bgLayer = parallaxRef.current.querySelector('.parallax-bg');
      if (bgLayer) {
        const translateY = scrollY * 0.3; // Mouvement plus lent (30% de la vitesse de défilement)
        (bgLayer as HTMLElement).style.transform = `translateY(${translateY}px)`;
      }
      
      // Effet parallax sur les éclaboussures
      document.querySelectorAll('.paint-splash').forEach((splash) => {
        const depth = parseFloat(splash.getAttribute('data-depth') || '0');
        const translateY = scrollY * depth;
        (splash as HTMLElement).style.transform = `translateY(${translateY}px) 
          rotate(${splash.getAttribute('data-rotation')}deg) 
          scale(${splash.getAttribute('data-scale')})`;
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fond avec effet parallax */}
      <div ref={parallaxRef} className="fixed inset-0 w-full h-full z-0">
        <div className="parallax-bg absolute inset-0 bg-black/90">
          {/* Grille pour donner de la texture */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.15) 1px, transparent 1px)',
              backgroundSize: '35px 35px',
            }}
          />
          
          {/* Vignette pour l'effet sombre sur les bords */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
            }}
          />
        </div>
        
        {/* Éclaboussures de peinture avec effet parallax */}
        {paintSplashes.map((splash, index) => (
          <div 
            key={`splash-${index}`}
            className={`paint-splash absolute pointer-events-none transition-transform duration-300 ease-out`}
            style={{
              left: `${splash.x}%`,
              top: `${splash.y}%`,
              zIndex: splash.depth < 0 ? 50 : 0, // Les éclaboussures avec depth négative sont au-dessus du contenu
              opacity: splash.opacity || 1
            }}
            data-depth={splash.depth}
            data-rotation={splash.rotation}
            data-scale={splash.scale}
          >
            <img 
              src={splash.src}
              alt="Paint splash"
              className="w-auto h-auto max-w-[300px] max-h-[300px] object-contain"
              style={{
                filter: 'contrast(1.5) brightness(1.2)',
                mixBlendMode: 'screen',
                transform: `rotate(${splash.rotation}deg) scale(${splash.scale})`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Container pour le contenu avec un z-index plus élevé */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
