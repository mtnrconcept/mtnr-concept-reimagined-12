
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const parallaxElements = [
  // Background layers
  { type: 'background', depth: 0.1, className: 'opacity-90' },
  
  // Pipes and industrial elements
  { type: 'pipe', x: 15, y: 20, depth: 0.3, rotation: -25, scale: 1.2, className: 'opacity-80' },
  { type: 'pipe', x: 85, y: 45, depth: 0.4, rotation: 15, scale: 0.8, className: 'opacity-70' },
  
  // Neon lights
  { type: 'light', x: 25, y: 30, depth: 0.5, size: 40, glow: 'yellow', className: 'opacity-60' },
  { type: 'light', x: 75, y: 60, depth: 0.6, size: 25, glow: 'blue', className: 'opacity-50' },
  
  // Ventilation grids
  { type: 'vent', x: 10, y: 70, depth: 0.7, scale: 1, className: 'opacity-90' },
  { type: 'vent', x: 90, y: 25, depth: 0.8, scale: 0.8, className: 'opacity-80' },
];

export default function ParallaxScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let scrollY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleScroll = () => {
      scrollY = window.scrollY;
      updateParallax();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX = (clientX / window.innerWidth - 0.5) * 2;
      mouseY = (clientY / window.innerHeight - 0.5) * 2;
      updateParallax();
    };

    const updateParallax = () => {
      container.querySelectorAll('.parallax-element').forEach((element) => {
        const el = element as HTMLElement;
        const depth = parseFloat(el.dataset.depth || '0');
        const x = parseFloat(el.dataset.x || '0');
        const y = parseFloat(el.dataset.y || '0');
        
        const translateY = scrollY * depth;
        const rotateX = mouseY * (depth * 5);
        const rotateY = mouseX * (depth * 5);
        const translateZ = depth * -100;

        el.style.transform = `
          translate3d(${x}%, ${y + translateY}px, ${translateZ}px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      {/* Main background image */}
      <div 
        className="absolute inset-0 w-full h-full parallax-element"
        data-depth="0.1"
        style={{
          backgroundImage: 'url("/lovable-uploads/c0a483ca-deba-4667-a277-1e85c6960e36.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Parallax elements */}
      {parallaxElements.map((element, index) => {
        if (element.type === 'background') return null;

        return (
          <div
            key={`${element.type}-${index}`}
            className={cn(
              'parallax-element absolute pointer-events-none',
              element.className
            )}
            data-depth={element.depth}
            data-x={element.x}
            data-y={element.y}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
          >
            {element.type === 'pipe' && (
              <div 
                className="bg-zinc-800 rounded-full shadow-2xl"
                style={{
                  width: '60px',
                  height: '12px',
                  transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
                  boxShadow: '0 0 15px rgba(0,0,0,0.5)',
                }}
              />
            )}

            {element.type === 'light' && (
              <div 
                className="rounded-full mix-blend-screen animate-pulse"
                style={{
                  width: `${element.size}px`,
                  height: `${element.size}px`,
                  background: `radial-gradient(circle, ${element.glow}, transparent 70%)`,
                  filter: 'blur(8px)',
                }}
              />
            )}

            {element.type === 'vent' && (
              <div 
                className="bg-zinc-900/80 border border-zinc-800"
                style={{
                  width: '40px',
                  height: '30px',
                  transform: `scale(${element.scale})`,
                }}
              >
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute bg-zinc-700 w-full h-[2px]"
                    style={{ top: `${(i + 1) * 25}%` }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Overlay for depth effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Noise texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgE1xQAAAABd0Uk5TABAgMEBQYHCAj5+vv8/f7//////////ro6iZAAAAQ0lEQVQ4y2NgQAX8/PyGDIQB4w5UgKEvWEABhEEYhEEYhEEYhEEYhEEYhEEYhEEYhEEYhEEYhEEYhEEYhEEYhEGYQRgAn0EYbO4vO3MAAAAASUVORK5CYII=")',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
