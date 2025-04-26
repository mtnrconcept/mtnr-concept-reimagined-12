
import { useState, useEffect } from 'react';
import { Flashlight as FlashlightIcon, FlashlightOff } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

export const Flashlight = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isEnabled) return;
      
      // Prendre en compte la position de défilement pour un suivi précis
      setPosition({
        x: e.clientX,
        y: e.clientY + window.scrollY
      });
    };
    
    // Gérer également le défilement pour mettre à jour la position
    const handleScroll = () => {
      if (!isEnabled || !position.x) return;
      
      // Mettre à jour la position Y lors du défilement
      setPosition(prev => ({
        x: prev.x,
        y: prev.y + (window.scrollY - (prev.y - e.clientY))
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isEnabled, position.x]);

  if (!isEnabled) {
    return (
      <Toggle 
        className="fixed right-4 top-24 z-[9999] bg-black/20 hover:bg-black/40"
        pressed={isEnabled}
        onPressedChange={setIsEnabled}
      >
        <FlashlightOff className="h-5 w-5 text-yellow-400" />
      </Toggle>
    );
  }

  return (
    <>
      <Toggle 
        className="fixed right-4 top-24 z-[9999] bg-black/20 hover:bg-black/40"
        pressed={isEnabled}
        onPressedChange={setIsEnabled}
      >
        <FlashlightIcon className="h-5 w-5 text-yellow-400" />
      </Toggle>
      
      <div
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          maskImage: `radial-gradient(circle 500px at ${position.x}px ${position.y - window.scrollY}px, transparent, black)`,
          WebkitMaskImage: `radial-gradient(circle 500px at ${position.x}px ${position.y - window.scrollY}px, transparent, black)`,
          background: 'rgba(0, 0, 0, 0.92)',
          backdropFilter: 'blur(1px)',
        }}
      >
        <div
          className="pointer-events-none absolute"
          style={{
            left: position.x,
            top: position.y - window.scrollY,
            width: '1000px',
            height: '1000px',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255, 221, 0, 0.15) 0%, rgba(255, 221, 0, 0.05) 30%, transparent 70%)',
            filter: 'blur(30px)',
            mixBlendMode: 'soft-light'
          }}
        />
      </div>
    </>
  );
};
