
import React, { useRef, useEffect, useState, memo, useMemo } from 'react';
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

const UVHiddenDrawing = memo(({
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
}: UVHiddenDrawingProps) => {
  const drawingRef = useRef<HTMLImageElement>(null);
  const { isTorchActive, mousePosition } = useTorch();
  const { uvMode } = useUVMode();
  const [isVisible, setIsVisible] = useState(false);
  
  // Définir les styles avec useMemo avant toute condition de retour
  const containerStyle = useMemo(() => ({
    left: typeof position.x === 'number' ? `${position.x}%` : position.x,
    top: typeof position.y === 'number' ? `${position.y}%` : position.y,
    transform: `rotate(${rotation}deg) scale(${scale})`,
    opacity: isVisible ? 1 : 0,
    zIndex: 50
  }), [position.x, position.y, rotation, scale, isVisible]);
  
  const imageStyle = useMemo(() => ({
    width,
    height,
    filter: `drop-shadow(0 0 8px ${glowColor})`,
    transition: 'all 0.3s ease-out'
  }), [width, height, glowColor]);

  useEffect(() => {
    if (!drawingRef.current || !isTorchActive || !uvMode) return;
    
    // Set visibility to true when in UV mode with torch active
    setIsVisible(true);
    
    // Add pulsing glow effect with efficient animation
    let animationId: number;
    
    const animate = () => {
      if (!drawingRef.current) return;
      const time = Date.now() / 1000;
      const intensity = (Math.sin(time * 1.5) + 1) / 2; // 0 to 1
      
      // Use requestAnimationFrame for smooth animation with least impact
      drawingRef.current.style.filter = `drop-shadow(0 0 ${8 + (intensity * 15)}px ${glowColor})`;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
      setIsVisible(false);
    };
  }, [uvMode, isTorchActive, glowColor]);

  // Conditionnez le rendu après avoir défini tous les hooks
  if (!uvMode || !isTorchActive) {
    return <></>;
  }

  return (
    <div
      className={`absolute pointer-events-none select-none transition-all duration-700 ${className}`}
      data-depth={depth}
      style={containerStyle}
    >
      <img
        ref={drawingRef}
        src={src}
        alt={alt}
        style={imageStyle}
        className="animate-pulse"
        loading="lazy" // Amélioration des performances de chargement
      />
    </div>
  );
});

UVHiddenDrawing.displayName = 'UVHiddenDrawing';

export default UVHiddenDrawing;
