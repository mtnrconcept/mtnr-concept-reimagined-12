
import { useState, useEffect } from 'react';
import { Flashlight as FlashlightIcon, FlashlightOff } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

export const Flashlight = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isEnabled) return;
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
        className="pointer-events-none fixed z-[9998] transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: position.x,
          top: position.y,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 221, 0, 0.2) 0%, rgba(255, 221, 0, 0.1) 20%, transparent 70%)',
          filter: 'blur(10px)',
          mixBlendMode: 'screen'
        }}
      />
      <div 
        className="pointer-events-none fixed inset-0 z-[9997] transition-opacity duration-300"
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(2px)'
        }}
      />
    </>
  );
};
