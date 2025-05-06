
import React from 'react';
import { cn } from '@/lib/utils';

interface FlickeringNeonTextProps {
  text: string;
  className?: string;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  fontSize?: string;
}

export default function FlickeringNeonText({
  text,
  className,
  color = "#D946EF",
  intensity = 'medium',
  fontSize = "0.875rem"
}: FlickeringNeonTextProps) {
  // Déterminer les classes d'intensité
  const intensityClass = {
    low: "flicker-low",
    medium: "flicker-medium",
    high: "flicker-high"
  }[intensity];
  
  return (
    <div className="relative z-[999]">
      <p
        className={cn(
          "flickering-neon-text",
          intensityClass,
          className
        )}
        style={{
          fontSize,
          color,
          textShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
          zIndex: 999
        }}
      >
        {text}
      </p>
    </div>
  );
}
