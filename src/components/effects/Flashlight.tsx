
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

      // Interpolation plus fluide pour le suivi du curseur
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      setPosition({
        x: currentX,
        y: currentY
      });

      frameRef.current = requestAnimationFrame(updatePosition);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isEnabled) return;
      
      // Utilise directement les coordonnées du curseur
      targetX = e.clientX;
      targetY = e.clientY;
      
      // Si premier mouvement, positionnement immédiat
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

  return (
    <>
      <Toggle 
        className="fixed right-4 top-24 z-[9999] bg-black/20 hover:bg-black/40"
        pressed={isEnabled}
        onPressedChange={setIsEnabled}
      >
        {isEnabled ? (
          <FlashlightIcon className="h-5 w-5 text-yellow-400" />
        ) : (
          <FlashlightOff className="h-5 w-5 text-yellow-400" />
        )}
      </Toggle>
      
      {isEnabled && (
        <div
          className="flashlight-overlay pointer-events-none fixed inset-0 z-[9999]"
          style={{
            // Inversé le masque pour que la zone éclairée soit transparente
            maskImage: `radial-gradient(circle 500px at ${position.x}px ${position.y}px, transparent, black)`,
            WebkitMaskImage: `radial-gradient(circle 500px at ${position.x}px ${position.y}px, transparent, black)`,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(1px)',
            isolation: 'isolate', // Assure que l'effet reste isolé
          }}
        >
          {/* Effet de lueur jaune */}
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
      )}
    </>
  );
};
