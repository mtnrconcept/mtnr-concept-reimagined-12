
import React, { useRef, useEffect, useState } from 'react';
import { useTorch } from "./TorchContext";
import { useUVMode } from "./UVModeContext";

interface UVSecretMessageProps {
  message: string;
  position: {
    x: number | string;
    y: number | string;
  };
  depth?: string;
  color?: string;
  size?: string;
  rotation?: number;
}

export default function UVSecretMessage({
  message,
  position,
  depth = "0.2",
  color = "#D2FF3F",
  size = "1.5rem",
  rotation = 0
}: UVSecretMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const { isTorchActive, mousePosition } = useTorch();
  const { uvMode } = useUVMode();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!messageRef.current || !isTorchActive || !uvMode) return;

    const handleVisibility = () => {
      if (!messageRef.current) return;
      
      // Calculate distance between mouse and element
      const rect = messageRef.current.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;
      
      const dx = mousePosition.x - elementCenterX;
      const dy = mousePosition.y - elementCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Augmenter la distance d'activation
      const threshold = 150; 
      
      // Show only when UV torch is close and in UV mode
      if (distance < threshold && uvMode) {
        setIsVisible(true);
        
        if (messageRef.current) {
          // Calculate intensity based on distance (stronger when closer)
          const intensity = 1 - (distance / threshold);
          
          // Apply visibility with a smooth transition
          messageRef.current.style.opacity = intensity.toFixed(2);
          
          // Add stronger glow effect when closer
          const glowSize = 5 + (intensity * 15);
          messageRef.current.style.textShadow = `0 0 ${glowSize}px ${color}, 0 0 ${glowSize * 2}px ${color}`;
          
          // Add subtle animation based on time
          const time = Date.now() / 1000;
          const vibrationX = Math.sin(time * 1.5) * 0.7;
          const vibrationY = Math.cos(time * 1.8) * 0.7;
          messageRef.current.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) translate(${vibrationX}px, ${vibrationY}px)`;
        }
      } else {
        // Hide when cursor is far
        setIsVisible(false);
        
        if (messageRef.current) {
          messageRef.current.style.opacity = '0';
          messageRef.current.style.textShadow = 'none';
          messageRef.current.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        }
      }
    };
    
    // Setup event listener for cursor movement
    window.addEventListener('mousemove', handleVisibility);
    
    // Initial visibility check
    handleVisibility();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleVisibility);
    };
  }, [isTorchActive, mousePosition, message, color, uvMode, rotation]);

  // Don't render anything if torch is off or not in UV mode
  if (!isTorchActive || !uvMode) return null;

  return (
    <div
      ref={messageRef}
      className={`uv-secret-message pointer-events-none select-none z-20 ${isVisible ? 'visible' : ''}`}
      style={{
        position: 'absolute',
        left: typeof position.x === 'number' ? `${position.x}%` : position.x,
        top: typeof position.y === 'number' ? `${position.y}%` : position.y,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        opacity: 0,
        color,
        fontSize: size,
        letterSpacing: '0.07em',
        whiteSpace: 'nowrap',
        textShadow: `0 0 5px ${color}`,
        fontWeight: 'bold',
        transition: 'opacity 0.3s ease-out, text-shadow 0.3s ease-out',
        zIndex: 100,
      }}
      data-depth={depth}
    >
      {message}
    </div>
  );
}
