
import { useRef, useEffect } from 'react';
import { use3DParallax } from '@/hooks/use3DParallax';
import { useUVMode } from './effects/UVModeContext';
import { parallaxElements } from './parallax/config';
import { PaintSplash } from './parallax/PaintSplash';
import UVSecretMessage from './effects/UVSecretMessage';

export default function Parallax3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { uvMode } = useUVMode();
  
  // Use enhanced 3D parallax effect
  use3DParallax(containerRef, {
    strength: 45,
    perspective: 1000,
    easing: 0.08
  });
  
  // Add subtle animation to elements on mount
  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll('.parallax-element');
    elements?.forEach((el, index) => {
      const element = el as HTMLElement;
      // Stagger animation of elements
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = element.style.transform + ' scale(1)';
      }, index * 120);
    });
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        zIndex: 0
      }}
    >
      {/* Background with blending modes */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-90"
        data-depth="0.05"
        style={{ 
          backgroundImage: `url("/lovable-uploads/edc0f8c8-4feb-44fd-ad3a-d1bf77f75bf6.png")`,
          filter: 'contrast(1.1) brightness(1.05)',
          transition: 'all 0.5s ease-out',
        }}
      />
      
      {/* Ambient fog effect */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-transparent to-black/60 pointer-events-none"
        data-depth="0.02"
        style={{
          opacity: 0.7,
          mixBlendMode: 'multiply'
        }}
      />
      
      {/* Grid lines */}
      <div 
        className="absolute inset-0 opacity-10"
        data-depth="0.1"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 221, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 221, 0, 0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px', 
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Paint splash elements */}
      {parallaxElements
        .filter(el => el.type === 'paint')
        .map((splash, index) => (
          <PaintSplash
            key={`splash-${index}`}
            x={splash.x!}
            y={splash.y!}
            depth={splash.depth}
            scale={splash.scale}
            rotation={splash.rotation}
            className="opacity-0 transition-all duration-1000"
            src={splash.src!}
            blur={splash.blur}
          />
        ))}
      
      {/* UV-only elements that only appear in UV mode */}
      {uvMode && (
        <>
          {/* Hidden UV pattern 1 */}
          <div 
            className="absolute w-full h-full pointer-events-none"
            data-depth="0.15"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 20%, #4FA9FF 0%, transparent 5%), radial-gradient(circle at 70% 60%, #D2FF3F 0%, transparent 5%)',
              backgroundSize: '300px 300px',
              opacity: 0.6,
              mixBlendMode: 'screen'
            }}
          />
          
          {/* UV circuit pattern */}
          <div 
            className="absolute inset-0 pointer-events-none"
            data-depth="0.2"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10,50 L30,30 L70,30 L90,50 L70,70 L30,70 Z\' fill=\'none\' stroke=\'%234FA9FF\' stroke-width=\'1\' /%3E%3C/svg%3E")',
              backgroundSize: '100px 100px',
              opacity: 0.2,
              mixBlendMode: 'screen'
            }}
          />
          
          {/* UV secret messages */}
          <UVSecretMessage
            message="STUDIO UNDERGROUND"
            position={{ x: 20, y: 15 }}
            size="2rem"
            color="#D2FF3F"
            depth="0.05"
          />
          
          <UVSecretMessage
            message="◉ ZONE INTERDITE ◉"
            position={{ x: 70, y: 75 }}
            size="1.2rem"
            color="#FF00DD"
            depth="0.15"
          />
          
          <UVSecretMessage
            message="RÉSERVÉ AUX INITIÉS"
            position={{ x: 50, y: 40 }}
            size="1.5rem"
            color="#4FA9FF"
            depth="0.1"
            rotation={-5}
          />
        </>
      )}
    </div>
  );
}
