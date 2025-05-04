
import React, { useState, useEffect, memo } from 'react';
import { Flashlight, ChevronUp, ChevronDown } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";

interface FlashlightIconProps {
  isTorchActive: boolean;
  mousePosition: { x: number; y: number };
  uvMode: boolean;
  isFingerDown?: boolean;
}

export const FlashlightIcon: React.FC<FlashlightIconProps> = memo(({
  isTorchActive,
  mousePosition,
  uvMode,
  isFingerDown = true
}) => {
  const isMobile = useIsMobile();
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  
  useEffect(() => {
    if (!isTorchActive || !isFingerDown) {
      setScrollDirection(null);
      return;
    }
    
    const windowHeight = window.innerHeight;
    const centerY = windowHeight / 2;
    const deadZone = windowHeight * 0.2;
    const topDeadZoneLimit = centerY - deadZone / 2;
    const bottomDeadZoneLimit = centerY + deadZone / 2;
    
    if (mousePosition.y < topDeadZoneLimit) {
      setScrollDirection('up');
    } else if (mousePosition.y > bottomDeadZoneLimit) {
      setScrollDirection('down');
    } else {
      setScrollDirection(null);
    }
  }, [isTorchActive, mousePosition.y, isFingerDown]);

  if (!isTorchActive) return null;

  return (
    <div 
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        transform: 'translate(-50%, -80%)',
        transition: 'none', // Supprimé la transition pour un suivi immédiat
        opacity: isFingerDown ? 1 : 0.7,
        willChange: 'left, top' // Optimisation pour le rendu
      }}
    >
      <Flashlight 
        size={isMobile ? 24 : 28} 
        className={`drop-shadow-md ${uvMode ? 'text-purple-400' : 'text-yellow-300'}`}
        strokeWidth={1.5}
      />
      
      {isFingerDown && scrollDirection === 'up' && (
        <ChevronUp 
          size={16} 
          className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${uvMode ? 'text-purple-300' : 'text-yellow-200'} animate-bounce opacity-80`}
        />
      )}
      
      {isFingerDown && scrollDirection === 'down' && (
        <ChevronDown 
          size={16} 
          className={`absolute -bottom-5 left-1/2 transform -translate-x-1/2 ${uvMode ? 'text-purple-300' : 'text-yellow-200'} animate-bounce opacity-80`}
        />
      )}
      
      <div 
        className={`absolute w-5 h-5 rounded-full blur-sm ${uvMode ? 'bg-purple-500/40' : 'bg-yellow-200/60'}`}
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, 20%)',
        }}
      />
    </div>
  );
});

FlashlightIcon.displayName = 'FlashlightIcon';
