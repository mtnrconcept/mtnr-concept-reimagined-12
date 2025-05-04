
import React from 'react';
import { cn } from '@/lib/utils';

interface ElectricTextProps {
  text: string;
  className?: string;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md' | 'lg';
}

export default function ElectricText({
  text,
  className,
  color = "#D2FF3F",
  intensity = 'medium',
  size = 'md'
}: ElectricTextProps) {
  // Classes de taille
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }[size];
  
  // Intensité de l'effet électrique
  const intensityClass = {
    low: "enhanced-electric-text-low",
    medium: "enhanced-electric-text",
    high: "enhanced-electric-text-high"
  }[intensity];
  
  return (
    <div className="relative inline-block">
      <span
        className={cn(
          intensityClass,
          sizeClasses,
          className
        )}
        style={{ 
          color, 
          textShadow: `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}`
        }}
      >
        {text}
      </span>
    </div>
  );
}
