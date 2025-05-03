
import { useRef, useEffect } from 'react';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const paintSplashes = [
    { src: '/lovable-uploads/paint-splatter-hi.png', x: 80, y: 15, depth: 0.3, scale: 1.6, rotation: -15 },
    { src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', x: 10, y: 25, depth: 0.4, scale: 1.4, rotation: 20 },
    { src: '/lovable-uploads/yellow-watercolor-splatter-3.png', x: 70, y: 60, depth: 0.1, scale: 1.1, rotation: 5 },
    { src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', x: 20, y: 85, depth: -0.3, scale: 0.8, rotation: -10, opacity: 0.2 }
  ];

  useEffect(() => {
    let ticking = false;
    let lastKnownScrollPosition = 0;
    let lastKnownMouseX = 0;
    let lastKnownMouseY = 0;

    const updateElements = () => {
      if (!parallaxRef.current) return;
      
      const scrollY = lastKnownScrollPosition;
      const mouseX = lastKnownMouseX;
      const mouseY = lastKnownMouseY;
      
      // Mettre à jour les éclaboussures de peinture avec un effet parallaxe
      document.querySelectorAll('.paint-splash').forEach((splash) => {
        const depth = parseFloat(splash.getAttribute('data-depth') || '1');
        // Vitesse proportionnelle à la profondeur (plus profond = plus lent)
        // Mouvement dans la MÊME direction que le défilement (vers le HAUT quand on scroll vers le BAS)
        const translateY = -scrollY * depth * 0.15; // Négatif pour aller vers le haut
        
        // Effet de souris également plus subtil
        const offsetX = mouseX * 15 * depth;
        const offsetY = mouseY * 15 * depth;
        
        (splash as HTMLElement).style.transform = `
          translate3d(${offsetX}px, ${translateY}px, ${depth * 100}px) 
          rotate(${splash.getAttribute('data-rotation')}deg) 
          scale(${splash.getAttribute('data-scale')})
        `;
      });
    };

    const handleScroll = () => {
      lastKnownScrollPosition = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateElements();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      lastKnownMouseX = (e.clientX / window.innerWidth - 0.5);
      lastKnownMouseY = (e.clientY / window.innerHeight - 0.5);
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateElements();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ perspective: '1000px' }}>
      {/* Conteneur pour les effets parallax */}
      <div ref={parallaxRef} className="fixed inset-0 w-full h-full z-0">
        {/* Grille pour donner de la texture, sans fond noir */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.15) 1px, transparent 1px)',
            backgroundSize: '35px 35px',
            transform: 'translateZ(-10px)'
          }}
        />
        
        {/* Éclaboussures de peinture avec effet parallax (réduites en nombre) */}
        {paintSplashes.map((splash, index) => (
          <div 
            key={`splash-${index}`}
            className={`paint-splash absolute pointer-events-none`}
            style={{
              left: `${splash.x}%`,
              top: `${splash.y}%`,
              zIndex: splash.depth < 0 ? 50 : 0,
              opacity: splash.opacity || 0.25,
              willChange: 'transform'
            }}
            data-depth={splash.depth}
            data-rotation={splash.rotation}
            data-scale={splash.scale}
          >
            <img 
              src={splash.src}
              alt="Paint splash"
              className="w-auto h-auto max-w-[250px] max-h-[250px] object-contain"
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
