
import React from 'react';
import { Flashlight } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";

interface FlashlightIconProps {
  isTorchActive: boolean;
  mousePosition: { x: number; y: number };
  uvMode: boolean;
}

export const FlashlightIcon: React.FC<FlashlightIconProps> = ({
  isTorchActive,
  mousePosition,
  uvMode
}) => {
  const isMobile = useIsMobile();

  if (!isTorchActive) return null;

  return (
    <div 
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        transform: 'translate(-50%, -80%)',
        transition: isMobile ? 'none' : 'left 0.05s ease-out, top 0.05s ease-out',
      }}
    >
      <Flashlight 
        size={isMobile ? 24 : 28} 
        className={`drop-shadow-md ${uvMode ? 'text-purple-400' : 'text-yellow-300'}`}
        strokeWidth={1.5}
      />
      {/* Lumière émise par la lampe */}
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
};
