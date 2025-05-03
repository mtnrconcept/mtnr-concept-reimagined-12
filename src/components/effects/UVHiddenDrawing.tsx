
import React, { useRef, useEffect, useState } from 'react';
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";

interface UVHiddenDrawingProps {
  src: string;
  alt: string;
  className?: string;
  width?: string;
  height?: string;
  position: {
    x: string | number;
    y: string | number;
  };
  rotation?: number;
  scale?: number;
  depth?: string;
  glowColor?: string;
}

export default function UVHiddenDrawing({
  src,
  alt,
  className = "",
  width = "150px",
  height = "auto",
  position,
  rotation = 0,
  scale = 1,
  depth = "0.2",
  glowColor = "#D2FF3F"
}: UVHiddenDrawingProps) {
  const drawingRef = useRef<HTMLImageElement>(null);
  const { isTorchActive, mousePosition } = useTorch();
  const { uvMode } = useUVMode();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!drawingRef.current || !isTorchActive) return;

    const handleVisibility = () => {
      if (!drawingRef.current) return;
      
      if (uvMode && isTorchActive) {
        // Activate the hidden drawing with animation
        setIsVisible(true);
        
        // Add pulsing glow effect
        const animate = () => {
          if (!drawingRef.current) return;
          const time = Date.now() / 1000;
          const intensity = (Math.sin(time * 1.5) + 1) / 2; // 0 to 1
          
          // Dynamic glow effect
          drawingRef.current.style.filter = `drop-shadow(0 0 ${8 + (intensity * 15)}px ${glowColor})`;
          requestAnimationFrame(animate);
        };
        
        const animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
      } else {
        // Hide when UV mode is off
        setIsVisible(false);
      }
    };
    
    handleVisibility();
    window.addEventListener('mousemove', handleVisibility);
    
    return () => {
      window.removeEventListener('mousemove', handleVisibility);
    };
  }, [uvMode, isTorchActive, mousePosition, glowColor]);

  if (!uvMode || !isTorchActive) return null;

  return (
    <div
      className={`absolute pointer-events-none select-none transition-all duration-700 ${className}`}
      data-depth={depth}
      style={{
        left: typeof position.x === 'number' ? `${position.x}%` : position.x,
        top: typeof position.y === 'number' ? `${position.y}%` : position.y,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        opacity: isVisible ? 1 : 0,
        zIndex: 50
      }}
    >
      <img
        ref={drawingRef}
        src={src}
        alt={alt}
        style={{
          width,
          height,
          filter: `drop-shadow(0 0 8px ${glowColor})`,
          transition: 'all 0.3s ease-out',
        }}
        className="animate-pulse"
      />
    </div>
  );
}
