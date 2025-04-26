
import { useState, useEffect, useRef } from 'react';
import { Flashlight as FlashlightIcon, FlashlightOff } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

export const Flashlight = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const updatePosition = () => {
      if (!isEnabled) return;

      // Calcul plus fluide avec légère interpolation pour éviter les sauts brusques
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;

      setPosition({
        x: currentX,
        y: currentY
      });

      frameRef.current = requestAnimationFrame(updatePosition);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isEnabled) return;
      
      // On utilise directement les coordonnées du curseur dans la fenêtre visible
      targetX = e.clientX;
      targetY = e.clientY;
      
      // Si c'est le premier mouvement, on positionne immédiatement sans animation
      if (!frameRef.current) {
        currentX = targetX;
        currentY = targetY;
        setPosition({ x: currentX, y: currentY });
        frameRef.current = requestAnimationFrame(updatePosition);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isEnabled]);

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
          maskImage: `radial-gradient(circle 500px at ${position.x}px ${position.y}px, transparent, black)`,
          WebkitMaskImage: `radial-gradient(circle 500px at ${position.x}px ${position.y}px, transparent, black)`,
          background: 'rgba(0, 0, 0, 0.92)',
          backdropFilter: 'blur(1px)',
        }}
      >
        <div
          className="pointer-events-none absolute"
          style={{
            left: position.x,
            top: position.y,
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
