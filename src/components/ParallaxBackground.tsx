
import { useRef, useEffect } from 'react';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  // Réduit le nombre de splashes à 4 (au lieu de 6) et réduit leur taille
  const paintSplashes = [
    { src: '/lovable-uploads/paint-splatter-hi.png', x: 80, y: 15, depth: 0.3, scale: 1.6, rotation: -15 },
    { src: '/lovable-uploads/pngtree-ink-splash-black-splatter-brush-png-image_5837106.png', x: 10, y: 25, depth: 0.4, scale: 1.4, rotation: 20 },
    { src: '/lovable-uploads/yellow-watercolor-splatter-3.png', x: 70, y: 60, depth: 0.1, scale: 1.1, rotation: 5 },
    { src: '/lovable-uploads/yellow-watercolor-splatter-7-1024x639.png', x: 20, y: 85, depth: -0.3, scale: 0.8, rotation: -10, opacity: 0.2 }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      
      const scrollY = window.scrollY;
      
      // Effet parallax sur les éclaboussures
      document.querySelectorAll('.paint-splash').forEach((splash) => {
        const depth = parseFloat(splash.getAttribute('data-depth') || '0');
        const translateY = scrollY * depth;
        const translateZ = depth * 100; // Ajout de la dimension Z pour l'effet 3D
        (splash as HTMLElement).style.transform = `translateY(${translateY}px) 
          translateZ(${translateZ}px)
          rotate(${splash.getAttribute('data-rotation')}deg) 
          scale(${splash.getAttribute('data-scale')})`;
      });
      
      // Effet parallax appliqué à la vidéo de fond
      const videoBackground = document.querySelector('video');
      if (videoBackground) {
        videoBackground.style.transform = `translateY(${scrollY * 0.15}px)`;  // La vidéo se déplace à 15% de la vitesse de défilement
      }
    };
    
    // Effet parallax sur la souris également
    const handleMouseMove = (e: MouseEvent) => {
      if (!parallaxRef.current) return;
      
      const mouseX = (e.clientX / window.innerWidth - 0.5);
      const mouseY = (e.clientY / window.innerHeight - 0.5);
      
      document.querySelectorAll('.paint-splash').forEach((splash) => {
        const depth = parseFloat(splash.getAttribute('data-depth') || '0');
        const offsetX = mouseX * 25 * depth;
        const offsetY = mouseY * 25 * depth;
        
        const element = splash as HTMLElement;
        const currentTransform = element.style.transform;
        
        // Si la transformation contient déjà translateX/Y depuis l'événement de défilement,
        // nous ajoutons simplement les offsets de souris
        if (currentTransform.includes('translateY')) {
          element.style.transform = currentTransform.replace(
            'translateY',
            `translate3d(${offsetX}px, `
          ).replace(
            'px)',
            'px, 0px)'
          );
        } else {
          element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) 
            rotate(${splash.getAttribute('data-rotation')}deg) 
            scale(${splash.getAttribute('data-scale')})`;
        }
      });
      
      // Effet parallax de la souris sur la vidéo de fond
      const videoBackground = document.querySelector('video');
      if (videoBackground) {
        videoBackground.style.transform = `translate3d(${mouseX * -15}px, ${mouseY * -15}px, 0) translateY(${window.scrollY * 0.15}px)`;
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
            className={`paint-splash absolute pointer-events-none transition-transform duration-300 ease-out`}
            style={{
              left: `${splash.x}%`,
              top: `${splash.y}%`,
              zIndex: splash.depth < 0 ? 50 : 0, // Les éclaboussures avec depth négative sont au-dessus du contenu
              opacity: splash.opacity || 0.25 // Opacité réduite
            }}
            data-depth={splash.depth}
            data-rotation={splash.rotation}
            data-scale={splash.scale}
          >
            <img 
              src={splash.src}
              alt="Paint splash"
              className="w-auto h-auto max-w-[250px] max-h-[250px] object-contain" // Taille réduite
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
