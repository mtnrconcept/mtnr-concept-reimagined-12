import { useEffect, useRef } from 'react';
import { PaintSplash } from './parallax/PaintSplash';
import { Pipe } from './parallax/Pipe';
import { Light } from './parallax/Light';
import { Vent } from './parallax/Vent';

const parallaxElements = [
  // Background layers - reduced depth for slower movement
  { type: 'background', depth: 0.05, className: 'opacity-90' },
  
  // Paint splashes - Far Back layer
  { type: 'paint', x: 5, y: 10, depth: 0.1, scale: 0.6, rotation: -15, className: 'opacity-30', 
    src: '/lovable-uploads/4fdf517b-935e-4848-a014-c02754a79ce5.png' },
  { type: 'paint', x: 85, y: 5, depth: 0.12, scale: 0.5, rotation: 25, className: 'opacity-25',
    src: '/lovable-uploads/361c7d09-c2a5-413f-a973-c89812c3e85f.png' },
  
  // Paint splashes - Back layer
  { type: 'paint', x: 15, y: 25, depth: 0.2, scale: 0.8, rotation: -20, className: 'opacity-40',
    src: '/lovable-uploads/47a81307-0753-4601-86bb-da53c9a62002.png' },
  { type: 'paint', x: 75, y: 30, depth: 0.25, scale: 0.7, rotation: 15, className: 'opacity-35',
    src: '/lovable-uploads/6bcb3e5d-4148-4cc3-b30d-fa65979d2f3d.png' },
  
  // Pipes and industrial elements
  { type: 'pipe', x: 15, y: 20, depth: 0.3, rotation: -25, scale: 1.2, className: 'opacity-80' },
  { type: 'pipe', x: 85, y: 45, depth: 0.4, rotation: 15, scale: 0.8, className: 'opacity-70' },
  
  // Paint splashes - Middle layer
  { type: 'paint', x: 30, y: 45, depth: 0.45, scale: 1.2, rotation: -10, className: 'opacity-60',
    src: '/lovable-uploads/4bcc54d6-fbe7-4e59-ad3c-85be26c0556a.png' },
  { type: 'paint', x: 70, y: 50, depth: 0.5, scale: 1.1, rotation: 20, className: 'opacity-70',
    src: '/lovable-uploads/40b430f2-e89d-4f31-972c-42da68f93fc4.png' },
  
  // Neon lights
  { type: 'light', x: 25, y: 30, depth: 0.5, size: 40, glow: 'yellow', className: 'opacity-60' },
  { type: 'light', x: 75, y: 60, depth: 0.6, size: 25, glow: 'blue', className: 'opacity-50' },
  
  // Paint splashes - Front layer
  { type: 'paint', x: 20, y: 70, depth: 0.7, scale: 1.4, rotation: -25, className: 'opacity-80',
    src: '/lovable-uploads/4fdf517b-935e-4848-a014-c02754a79ce5.png' },
  { type: 'paint', x: 80, y: 80, depth: 0.8, scale: 1.3, rotation: 35, className: 'opacity-90',
    src: '/lovable-uploads/361c7d09-c2a5-413f-a973-c89812c3e85f.png' },
  
  // Ventilation grids
  { type: 'vent', x: 10, y: 70, depth: 0.7, scale: 1, className: 'opacity-90' },
  { type: 'vent', x: 90, y: 25, depth: 0.8, scale: 0.8, className: 'opacity-80' },
] as const;

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
      {/* Background image */}
      <div 
        className="absolute inset-0 w-full h-full parallax-element"
        data-depth="0.05"
        style={{
          backgroundImage: 'url("/lovable-uploads/c0a483ca-deba-4667-a277-1e85c6960e36.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Parallax elements */}
      {parallaxElements.map((element, index) => {
        if (element.type === 'background') return null;

        if (element.type === 'paint') {
          return (
            <PaintSplash
              key={`paint-${index}`}
              x={element.x}
              y={element.y}
              depth={element.depth}
              scale={element.scale}
              rotation={element.rotation}
              className={element.className}
              src={element.src}
            />
          );
        }

        if (element.type === 'pipe') {
          return (
            <Pipe
              key={`pipe-${index}`}
              x={element.x}
              y={element.y}
              depth={element.depth}
              scale={element.scale}
              rotation={element.rotation}
              className={element.className}
            />
          );
        }

        if (element.type === 'light') {
          return (
            <Light
              key={`light-${index}`}
              x={element.x}
              y={element.y}
              depth={element.depth}
              size={element.size}
              glow={element.glow}
              className={element.className}
            />
          );
        }

        if (element.type === 'vent') {
          return (
            <Vent
              key={`vent-${index}`}
              x={element.x}
              y={element.y}
              depth={element.depth}
              scale={element.scale}
              className={element.className}
            />
          );
        }

        return null;
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
